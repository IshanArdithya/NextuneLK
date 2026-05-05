# build stage
FROM node:20-alpine AS builder

WORKDIR /app

# install dependencies specifically for building
COPY package*.json ./
COPY prisma ./prisma/

# install dependencies including devDependencies for 'tsc'
RUN npm ci --legacy-peer-deps

# copy source code
COPY . .

# set dummy DATABASE_URL for build
ENV DATABASE_URL="postgresql://postgres:password@localhost:5432/nextunelk"

# generate prisma client
RUN npx prisma generate

# build the ts app
RUN npm run build

# production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# copy necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/src/scripts ./src/scripts

EXPOSE 8001

CMD ["npm", "start"]
