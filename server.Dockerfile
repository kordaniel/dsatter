FROM node:18.12-alpine

WORKDIR "/home/app"
COPY common/ ./common/

WORKDIR "/home/app/node-server"

COPY node-server/package.json ./
COPY node-server/package-lock.json ./
COPY node-server/src/ ./src
COPY node-server/*.js ./

RUN npm install

ENTRYPOINT ["npm", "run", "start", "--", "--port"]