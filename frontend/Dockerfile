# -----------------------------------------------------------------------------
# DOCKERFILE - FRONTEND REACT + VITE (ESTUDIO UTP)
# -----------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./

# Instalación de dependencias
RUN npm install

# Copiar código fuente
COPY . .

# Exponer puerto para Vite dev server
EXPOSE 3000

# Ejecutar el servidor de desarrollo Vite con hot-reload
CMD ["npm", "run", "dev"]
