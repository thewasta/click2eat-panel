FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g pnpm
COPY package*.json ./
COPY .env.vault ./
RUN #npm ci
RUN pnpm install

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
ARG DOTENV_KEY
ENV DOTENV_KEY=${DOTENV_KEY}
ENV NEXT_PRIVATE_STANDALONE true
WORKDIR /app
RUN npm install -g pnpm
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/.env.vault ./
COPY ../.. .
RUN pnpm dlx dotenv-vault local decrypt ${DOTENV_KEY} > .env
RUN pnpm build
# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder --chown=nextjs:nodejs /app/next.config.mjs ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
#COPY --from=builder /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#COPY --from=builder --chown=nextjs:nodejs /app/.env.vault ./
#COPY --from=builder /app/package.json ./package.json
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/.next ./.next
#COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.env ./
USER nextjs

EXPOSE 3000

#ENV PORT 3000
#ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]