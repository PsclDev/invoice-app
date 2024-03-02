FROM node:20-alpine AS development

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine As production

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY --from=development /usr/src/app/.output .

CMD ["node", "server/index.mjs"]