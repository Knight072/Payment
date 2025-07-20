# -------------------------------------------
# Stage 1: Builder
# -------------------------------------------
FROM node:18-alpine AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos package.json y package-lock.json e instalamos dependencias
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código fuente y compilamos
COPY . .
RUN npm run build

# -------------------------------------------
# Stage 2: Runtime
# -------------------------------------------
FROM node:18-alpine

WORKDIR /app

# Copiamos sólo el build resultante y los archivos de dependencias
COPY --from=builder /app/dist ./dist
COPY package*.json ./

# Instalamos sólo dependencias de producción
RUN npm ci --only=production

# Variables de entorno
ENV NODE_ENV=production

# Puerto que expone la aplicación (coincide con tu aplicación NestJS)
EXPOSE 3000

# Comando para arrancar la app
CMD ["node", "dist/main.js"]
