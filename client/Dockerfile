# Use an official Node runtime as base image
FROM node:14 AS build

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . ./

# Build the React app using Vite
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html