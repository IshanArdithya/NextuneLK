# NextuneVPN Web Production Infrastructure & Deployment Guide

This document is the complete reference for maintaining or deploying the NextuneVPN Web production stack.

## 1. System Architecture
- **Orchestration:** Docker Compose (Service-oriented)
- **Networking:** Private Bridge Network (`nextune_network`) - no public DB exposure.
- **Server User:** `deploy` (Dedicated non-root user with Docker permissions).
- **CI/CD:** GitHub Actions: Build → Push to GHCR → Deploy via SSH.
- **Backups:** Automated every 12 hours to Cloudflare R2 (S3-compatible).

## 2. Server-Side Setup (New VPS)

### 2.1 Required Tools
SSH into the new VPS as root and run the following:
```bash
# Update and install Docker
sudo apt update
sudo apt install docker.io docker-compose-v2 -y

# Install Rclone (for Cloudflare R2 Backups)
curl https://rclone.org/install.sh | sudo bash
```

### 2.2 Create the Deploy User
If the `deploy` user does not exist, create it and assign necessary permissions:
```bash
sudo adduser deploy
sudo usermod -aG docker deploy
sudo usermod -aG sudo deploy
```
*Note: Always use the `deploy` user for application operations, never root.*

### 2.3 Folder Structure
All application files reside in the `deploy` user's home directory:
- `/home/deploy/nextunelk/docker-compose.yml` (Auto-synced by GitHub)
- `/home/deploy/nextunelk/.env.nextunelk.prod` (Manual setup required)
- `/home/deploy/nextunelk/backup.sh` (Manual setup required)

## 3. Configuration Files

### 3.1 Environment File (.env.nextunelk.prod)
Create this file at `/home/deploy/nextunelk/.env.nextunelk.prod`.

```bash
# --- Server Config ---
PORT=8001
NODE_ENV=production
TRUST_PROXY=true

# --- Database (Docker Internal) ---
POSTGRES_USER=admin_db_user
POSTGRES_PASSWORD=secure_db_password
POSTGRES_DB=nextunedb

# --- Database (App Connection) ---
DATABASE_URL="postgresql://admin_db_user:secure_db_password@db:5432/nextunedb?schema=public"

# --- Public URLs ---
FRONTEND_URL=https://app.nextune.live
BETTER_AUTH_URL=https://app.nextune.live/api/auth

# --- Authentication ---
BETTER_AUTH_SECRET=base64_secret_here

# --- Admin Setup (Initial Seed) ---
DEFAULT_ADMIN_EMAIL=admin@domain.com
DEFAULT_ADMIN_PASSWORD=admin_password

# --- XUI Panel ---
XUI_WEB_URL=https://xui-url.com:2002/path
XUI_API_TOKEN=api_token_from_panel_settings

# --- Cloudflare R2 Backups ---
R2_ACCESS_KEY_ID=access_key
R2_SECRET_ACCESS_KEY=secret_key
R2_ACCOUNT_ID=account_id
R2_BUCKET_NAME=nextunelk-backups
```

## 4. GitHub Actions Secrets
Configure the following secrets in GitHub Repository Settings → Secrets and Variables → Actions:

| Secret Name | Description |
| :--- | :--- |
| `VPS_HOST` | Target server IP address |
| `VPS_USER` | `deploy` |
| `VPS_SSH_KEY` | Private SSH key for the deploy user |
| `NEXT_PUBLIC_API_BASE_URL` | Frontend API endpoint |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Frontend Auth endpoint |
| `NEXT_PUBLIC_ADMIN_URI_PATH` | Secret admin URI path |

## 5. Database Management

### Command Line Access
```bash
docker exec -it nextunelk-db psql -U admin_db_user -d nextunedb
```

### Remote GUI Access (SSH Tunnel)
Connect via DBeaver/TablePlus using an SSH tunnel:
- **Host:** `localhost`
- **Port:** `5432`
- **SSH Host:** VPS IP
- **SSH User:** `deploy`

## 6. Automated Backups

### 6.1 Setup `backup.sh`
1. Create `/home/deploy/nextunelk/backup.sh` and paste the following:

```bash
#!/bin/bash
# Load environment variables
source /home/deploy/nextunelk/.env.nextunelk.prod

BACKUP_DIR="/home/deploy/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="nextunelk_db_$TIMESTAMP.sql.gz"
mkdir -p $BACKUP_DIR

# Dump and compress the database
docker exec nextunelk-db pg_dump -U $POSTGRES_USER $POSTGRES_DB | gzip > $BACKUP_DIR/$FILENAME

# Upload to Cloudflare R2 via rclone
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export RCLONE_CONFIG_R2_ENDPOINT="https://$R2_ACCOUNT_ID.r2.cloudflarestorage.com"
export RCLONE_CONFIG_R2_ACL=private

rclone copy $BACKUP_DIR/$FILENAME r2:$R2_BUCKET_NAME/ --s3-no-check-bucket

# Clean up local files older than 7 days
find $BACKUP_DIR -type f -mtime +7 -name "*.sql.gz" -delete
```

2. Ensure the script is executable: `chmod +x backup.sh`.
3. Schedule via crontab (`crontab -e`):
   `0 */12 * * * /bin/bash /home/deploy/nextunelk/backup.sh >> /home/deploy/nextunelk/backup.log 2>&1`

## 7. Disaster Recovery (Restore)

### Step 1: Download Backup
```bash
rclone copy r2:nextunelk-backups/latest_backup.sql.gz ~/restore/ --s3-no-check-bucket
```

### Step 2: Initialize Database
```bash
docker compose up -d
```

### Step 3: Import Data
```bash
zcat ~/restore/backup_file.sql.gz | docker exec -i nextunelk-db psql -U admin_db_user -d nextunedb
```

## 8. Quick Redeployment Checklist
1. Provision VPS and create `deploy` user.
2. Install Docker and Rclone.
3. Update GitHub Actions secrets with the new IP/Key.
4. Manually place `.env.nextunelk.prod` and `backup.sh` in `~/nextunelk/`.
5. Trigger GitHub deployment.
6. Verify status with `docker compose ps`.
7. Restore data from Cloudflare R2 if necessary.
