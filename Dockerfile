# Use Node.js as the base image
FROM node:20-slim AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the frontend (React + Vite)
RUN npm run build

# --- Stage 2: Target Image ---
FROM node:20-slim

WORKDIR /app

# Copy production files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

# Expose the API and WebSocket port
EXPOSE 3001

# Environment variable for port
ENV PORT=3001

# Start the unified server
CMD ["npm", "start"]
