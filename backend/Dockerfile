FROM node:lts-bullseye AS development

RUN mkdir -p /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN yarn prebuild
RUN yarn build

EXPOSE $PORT
ENV PORT=$PORT

CMD [ "yarn", "start:prod" ]