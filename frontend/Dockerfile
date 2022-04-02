FROM node:lts-bullseye

RUN mkdir -p /app
WORKDIR /app

RUN apt update && apt upgrade -y

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN yarn build

EXPOSE $PORT
ENV NUXT_PORT=$PORT
ENV NUXT_HOST=0.0.0.0

CMD [ "yarn", "start" ]