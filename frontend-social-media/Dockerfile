# Use Node.js base image with Alpine Linux
FROM node:alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files into the container
COPY . .

# Expose port 5173 for Vite's development server
EXPOSE 5173

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=5173


# Start the application in development mode
CMD ["npm", "run", "dev"]