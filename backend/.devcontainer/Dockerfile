FROM node:21

# Create app directory
WORKDIR /app

# Update system
RUN apt update \
    && apt -y upgrade \
    # Install chrome for puppeteer
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions
COPY package.json .
COPY package-lock.json .

ENV DISABLE_ESLINT_PLUGIN=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_SKIP_DOWNLOAD=true

# Install dependecies
# ci won't modify package-lock.json
RUN npm ci

# Get all the code needed to run the app
COPY . .

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["npm", "run", "dev"]
