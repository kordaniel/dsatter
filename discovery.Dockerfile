FROM node:18.12-alpine

WORKDIR "/home/app"

COPY common/ ./common/

WORKDIR "/home/app/node-discovery"

COPY node-discovery/package.json ./
COPY node-discovery/package-lock.json ./
COPY node-discovery/utils/ ./utils/
COPY node-discovery/database/*.js ./database/
COPY node-discovery/controllers/ ./controllers/
COPY node-discovery/*.js ./

RUN npm install

EXPOSE 8080

ENTRYPOINT npm run start
