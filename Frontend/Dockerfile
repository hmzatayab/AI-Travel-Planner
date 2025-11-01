# Step 1: Use Node 22
FROM node:22.12.0

# Step 2: Working directory
WORKDIR /app

# Step 3: Copy package files
COPY package.json package-lock.json ./

# Step 4: Install dependencies
RUN npm config set registry https://registry.npmjs.org/
RUN npm install

# Step 5: Copy all files
COPY . .

# Step 6: Expose the frontend port
EXPOSE 5175

# Step 7: Enable hot reload for Docker
ENV CHOKIDAR_USEPOLLING=true

# Step 8: Start the Vite dev server on 0.0.0.0:5175
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5175"]
