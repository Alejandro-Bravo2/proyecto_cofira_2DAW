# ================================
# STAGE 1: Build
# ================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias primero (mejor cache)
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Build de producción
RUN npm run build

# ================================
# STAGE 2: Producción (Nginx)
# ================================
FROM nginx:alpine AS production

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build de Angular
COPY --from=builder /app/dist/cofira/browser /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# ================================
# STAGE 3: Desarrollo
# ================================
FROM node:20-alpine AS development

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Exponer puerto de desarrollo
EXPOSE 4200

# Comando para desarrollo (ng serve accesible desde fuera del contenedor)
CMD ["npm", "start", "--", "--host", "0.0.0.0"]
