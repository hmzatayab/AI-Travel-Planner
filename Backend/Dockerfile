# Base image
FROM node:20.18.0

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with error fixes
RUN npm install

# Copy entire source code
COPY . .

# Expose port
EXPOSE 3000

# Start server using tsx
CMD ["npm", "run", "dev"]