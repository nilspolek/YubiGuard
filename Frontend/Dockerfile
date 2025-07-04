# Use Node as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install -g @angular/cli && npm install

# Copy the rest of the application code
COPY . .

# Expose Angular default port
EXPOSE 4200

# Start Angular dev server
CMD ["ng", "serve", "--host", "0.0.0.0"]
