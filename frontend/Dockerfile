FROM node:lts-bullseye

RUN mkdir -p /app
WORKDIR /app

RUN apt update && apt upgrade -y

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .
RUN yarn build

EXPOSE 3000
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000

CMD [ "yarn", "start" ]