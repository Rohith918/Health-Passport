# ===== 1. Build Stage =====
# This stage builds both frontend and backend
FROM node:20-alpine AS builder
WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Run the build script from package.json
# This builds both frontend and backend
RUN npm run build

# ===== 2. Prune Dev Dependencies =====
# This stage removes devDependencies to keep the final image small
FROM node:20-alpine AS pruner
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ===== 3. Final Production Image =====
FROM node:20-alpine
WORKDIR /app

# Copy production node_modules from the pruner stage
COPY --from=pruner /app/node_modules ./node_modules
# Copy built backend from the builder stage
COPY --from=builder /app/dist/server ./dist/server
# Copy built frontend from the builder stage
COPY --from=builder /app/dist/client ./dist/client

EXPOSE 5000
CMD ["node", "dist/server/index.js"]