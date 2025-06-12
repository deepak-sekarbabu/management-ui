# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN npm run build

# Inform Docker that the container listens on port 3030 (vite preview default)
EXPOSE 3030

# Command to run the application
CMD ["npm", "run", "start", "--", "--host"]
