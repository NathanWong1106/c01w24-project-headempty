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
ENV DISABLE_ESLINT_PLUGIN=true

# Install dependecies
# ci won't modify package-lock.json
RUN npm ci

# Get all the code needed to run the app
COPY . .

EXPOSE 4000

# Serve the app
CMD ["npm", "start"]
