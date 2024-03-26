FROM node:20-alpine as base

RUN apk add --no-cache libc6-compat

WORKDIR /restaurant

COPY package.json package-lock.json ./

RUN npm ci

# Etapa para construcción y dev
FROM base as builder

COPY . .
RUN npm run build

# Etapa para producción
FROM base as prod
WORKDIR /restaurant
# Crear directorios necesarios
RUN mkdir -p /restaurant/.next/standalone /restaurant/.next/static

# Copiar archivos de la etapa de construcción
COPY --from=builder /restaurant/public ./public
COPY --from=builder /restaurant/.next/standalone ./.next/standalone
COPY --from=builder /restaurant/.next/static ./.next/static

USER node

CMD ["node", "server.js"]
