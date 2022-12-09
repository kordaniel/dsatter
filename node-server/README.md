# Dsatter chat server node
Node that runs the distributed chatserver network. Run 1..n instances on different hosts. Every node will query the discovery service for peers and attempt to initialize a websocket connection to every other node running in the network.

## Usage
Currently you can only test that the connections are formed and messages can be passed to every connected node. Read the run() function defined in index.js for implemented commands.

### Required arguments
When running on localhost with NODE_ENV=development, you must specify the db-path to use:
```
npm run dev -- --dbpath=<PATH_TO_FILE.db>
```
When running in containers with NODE_ENV=production, you must specify the port to listen for other nodes WebSocket connections:
```
npm run start -- --nodeservport=<BIND_PORT>
```
## Environment setup
```
npm install
```
## Configured commands
### Development environment
```
npm run dev
npm run lint
```
### Test environment
```
npm run test
```
### Production environment
```
npm run start -- --nodeservport=10101
```
The port number can be freely selected and does not need to be 10101.
