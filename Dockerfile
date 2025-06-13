# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN if [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Copy source code and env file
COPY . .

# Set environment variables for build
ENV VITE_API_BASE_URL=https://management-ui-pdj4.onrender.com
ENV VITE_APP_NAME="Management UI"
ENV VITE_APP_ENV=production
ENV VITE_APP_VERSION=1.0.0
ENV VITE_ENABLE_ANALYTICS=false
ENV VITE_ENABLE_LOGGING=true
ENV VITE_DEFAULT_PAGE_SIZE=10
ENV VITE_MAX_PAGE_SIZE=100

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Set NODE_ENV
ENV NODE_ENV=production

# Expose port
EXPOSE 3030

# Start the application
CMD ["npx", "serve", "dist", "-l", "3030"]
