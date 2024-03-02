FROM node:20-alpine AS development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

RUN apk add --no-cache --virtual .gyp \
        python3 \
        make \
        g++

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

COPY .npmrc .
COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine As production

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY .npmrc .
COPY package*.json .

RUN apk update && apk add --no-cache nmap && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk update && \
    apk add --no-cache \
      chromium \
      harfbuzz \
      "freetype>2.8" \
      ttf-freefont \
      nss

RUN apk add --no-cache --virtual .gyp \
      python3 \
      make \
      g++

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN npm ci --omit=dev

COPY --from=development /usr/src/app/dist ./dist

CMD ["npm", "run", "start:prod"]