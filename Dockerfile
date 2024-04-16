FROM node:18-alpine as build

RUN npm install -g pnpm


WORKDIR /app
COPY package.json /app/package.json

RUN pnpm install
COPY . /app

RUN pnpm run build:prod
CMD ["pnpm", "run", "start"]