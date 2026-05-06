# NextuneVPN Web

NextuneVPN Web is the management dashboard for NextuneVPN clients and services. It is built with a Next.js frontend, an Express.js backend, and uses Prisma for database management.

## Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS, Framer Motion
- **UI Components:** Radix UI (Shadcn UI)
- **Authentication:** Better Auth (Client-side)

### Backend
- **Framework:** Express.js
- **Database:** PostgreSQL via Prisma ORM
- **Security:** Helmet, HPP, Rate Limiting, XSS Sanitization
- **Logging:** Winston & Morgan
- **Authentication:** Better Auth (Server-side)

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/IshanArdithya/NextuneLK.git
cd NextuneLK
```

### 2. Setup the Backend
1. Navigate to the server folder: `cd server`
2. Install dependencies: `npm install`
3. Configure your `.env` file (see `server/.env.example`).
4. Initialize the database: `npx prisma db push`
5. Start development server: `npm run dev`

### 3. Setup the Frontend
1. Navigate to the client folder: `cd client`
2. Install dependencies: `npm install`
3. Configure your `.env` file (see `client/.env.example`).
4. Start development server: `npm run dev`

---

## Deployment & Infrastructure

The production environment is fully containerized using **Docker Compose** and features automated backups to **Cloudflare R2**.

For detailed instructions on server setup, CI/CD, and disaster recovery, please refer to the:
**[Deployment & Infrastructure Guide (DEPLOYMENT.md)](./DEPLOYMENT.md)**

