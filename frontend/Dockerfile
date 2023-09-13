# Use an official Node runtime as base image
FROM node:14

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . ./

# Build the React app
RUN npm run build

# Use Nginx to serve the static files
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html