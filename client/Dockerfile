FROM node:21 AS builder

# Create app directory
WORKDIR /app

# Update system
RUN apt update \
    && apt -y upgrade

# Copy dependency definitions
COPY package.json /app
COPY package-lock.json /app

ENV NODE_ENV=production
ENV REACT_APP_API_ADDRESS=https://c01-w24-backend.blueglacier-8f7255ec.canadaeast.azurecontainerapps.io
ENV DISABLE_ESLINT_PLUGIN=true

# Install dependecies
# ci won't modify package-lock.json
RUN npm ci

# Get all the code needed to run the app
COPY . .

# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.25.4-alpine AS prod

# Copy built assets from build
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
