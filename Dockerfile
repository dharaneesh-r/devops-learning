# 1. Base image
FROM node:20-alpine

# 2. Create app directory
WORKDIR /app

# 3. Copy package files
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy application code
COPY . .

# 6. Expose port
EXPOSE 8080

# 7. Start application
CMD ["npm", "run", "dev"]
