
# build stage
FROM node:20-alpine AS builder

WORKDIR /app

# install dependencies specifically for building
# copy package.json and package-lock.json (if available)
COPY package*.json ./

# install dependencies
RUN npm ci --legacy-peer-deps

# copy source code
COPY . .

# production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# copy necessary files from builder
COPY --from=builder /app ./

EXPOSE 8001

CMD ["npm", "start"]
