FROM node:20-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM node:20-alpine AS builder
ENV NEXT_PRIVATE_STANDALONE true
ARG DOTENV_KEY
ENV DOTENV_KEY=${DOTENV_KEY}
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY ../.. .
RUN ls -la
RUN env
RUN npm run build

# Production image, copy all the files and run next
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=BUILD_IMAGE /app/package*.json ./
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
EXPOSE 3000
CMD ["npm", "start"]
