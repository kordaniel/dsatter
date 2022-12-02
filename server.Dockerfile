FROM node:18.12-alpine

WORKDIR "/home/app"
COPY common/ ./common/

WORKDIR "/home/app/node-server"

COPY node-server/package.json ./
COPY node-server/package-lock.json ./
COPY node-server/utils/ ./utils/
COPY node-server/services/ ./services/
COPY node-server/sockets/ ./sockets/
COPY node-server/state/ ./state/
COPY node-server/*.js ./

RUN npm install

ENTRYPOINT ["npm", "run", "start", "--"]
