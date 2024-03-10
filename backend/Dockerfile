FROM --platform=linux/amd64 node:21

# Create app directory
WORKDIR /app

# Update system
RUN apt update \
    && apt -y upgrade \
    # For puppeteer
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install google-chrome-stable -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency definitions
COPY package.json /app
COPY package-lock.json /app

ENV NODE_ENV=production
ENV DISABLE_ESLINT_PLUGIN=true
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Install dependecies
# ci won't modify package-lock.json
RUN npm ci \
    # For puppeteer to work.
    # Add user so we don't need --no-sandbox.
    # same layer as npm install to keep re-chowned files from using up several hundred MBs more space
    && groupadd -r pptruser && useradd -r -g pptruser -G audio,video pptruser \
    && mkdir -p /home/pptruser/Downloads \
    && chown -R pptruser:pptruser /home/pptruser \
    && chown -R pptruser:pptruser node_modules \
    && chown -R pptruser:pptruser package.json \
    && chown -R pptruser:pptruser package-lock.json

# Run everything after as non-privileged user.
USER pptruser

# Get all the code needed to run the app
COPY . .

EXPOSE 4000

# Serve the app
CMD ["npm", "start"]
