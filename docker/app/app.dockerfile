FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci && \
    npm install sharp

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
ENV NEXT_PRIVATE_STANDALONE true
ARG DOTENV_KEY
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV DOTENV_KEY=${DOTENV_KEY}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx dotenv-vault local decrypt ${DOTENV_KEY} > .env
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
ENV PORT=3001
ENV HOST=0.0.0.0
ENV NODE_ENV=production
# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
USER nextjs


COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]