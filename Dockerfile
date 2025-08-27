FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
ENV NODE_ENV=production

RUN apk add --no-cache netcat-openbsd
RUN apk add --no-cache python3 py3-pip bash
EXPOSE 4000

CMD sh -c "until nc -z postgres 5432; do echo 'waiting for postgres...'; sleep 1; done; npx prisma migrate deploy && node src/server.js"
