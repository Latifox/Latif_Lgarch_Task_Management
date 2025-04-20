# Multi-stage build
# Stage 1: Build the frontend
FROM node:16-alpine as frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Setup the backend and copy frontend build
FROM node:16-alpine
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production
COPY backend/ ./
# Copy built frontend assets to backend's public directory
COPY --from=frontend-build /app/frontend/build ./public

# Set environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "src/index.js"] 