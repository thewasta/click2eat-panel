FROM node:20-alpine as base

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

# Etapa para construcción y dev
FROM base as builder

COPY . .
RUN ls -la /app/public
RUN npm run build

# Etapa para producción
FROM base as prod
WORKDIR /app
# Crear directorios necesarios
RUN mkdir -p /app/.next/standalone /app/.next/static

# Agregar este comando para verificar la existencia del directorio
RUN ls -la /app/.next

# Copiar archivos de la etapa de construcción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static

USER node

CMD ["node", "server.js"]
