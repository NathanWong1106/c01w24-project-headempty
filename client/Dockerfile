FROM node:21

# Create app directory
WORKDIR /app

# Update system
RUN apt update \
    && apt -y upgrade

# Copy dependency definitions
COPY package.json /app
COPY package-lock.json /app

ENV NODE_ENV=production

# Install dependecies
# ci won't modify package-lock.json
RUN npm ci

# Get all the code needed to run the app
COPY . /app

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
RUN npm run build

CMD ["npm", "run", "server"]
