# FROM node:23-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm i

# COPY . .

# EXPOSE 3001

# CMD ["node", "server.js"]

# Use Node.js official image
# Assuming your Dockerfile is in the root (BlogSphere directory)

# Use a Node.js image as the base image
# Use Node.js as the base image for backend
FROM node:23-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json files first for npm install (backend)
COPY ./backend/package*.json ./backend/

# Install dependencies for the backend
RUN npm install --prefix ./backend

# Copy the backend code into the container
COPY ./backend/ ./backend/

# Copy the frontend code into the container
COPY ./Frontend/ ./Frontend/

# Expose the backend port (3001)
EXPOSE 3001

# Command to start the backend application (adjust as needed)
CMD ["npm", "run", "dev", "--prefix", "./backend"]
