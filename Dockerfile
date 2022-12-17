# select your base image to start with
FROM node:16-alpine

ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"

RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium@edge \
    nss@edge

# Create app directory
# this is the location where you will be inside the container
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
# copying packages first helps take advantage of docker layers
COPY package*.json ./
COPY . .

RUN yarn install --pure-lockfile
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source

# Make this port accessible from outside the container
# Necessary for your browser to send HTTP requests to your Node app
EXPOSE 8080

# Command to run when the container is ready
# Separate arguments as separate values in the array
CMD [ "yarn", "run", "start:dev"]