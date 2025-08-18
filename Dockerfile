# judge-backend/Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
ENV NODE_ENV=production

# برای صبر کردن تا دیتابیس بالا بیاد از nc استفاده می‌کنیم
RUN apk add --no-cache netcat-openbsd
EXPOSE 4000

# فرض: فایل شروع شما server.js یا app.js هست. عوضش کن اگر متفاوته.
# همچنین فرض: بک‌اند PORT و DATABASE_URL رو از env می‌خونه.
CMD sh -c "until nc -z postgres 5432; do echo 'waiting for postgres...'; sleep 1; done; npx prisma migrate deploy && node src/server.js"
