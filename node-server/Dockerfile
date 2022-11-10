FROM node:18.12-alpine

WORKDIR "/home/app"

COPY package.json ./
COPY package-lock.json ./
COPY utils/ ./utils/
COPY *.js ./

RUN npm install

EXPOSE 10101

ENTRYPOINT npm run start