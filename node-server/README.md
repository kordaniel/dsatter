# Dsatter chat server node
Node that runs the distributed chatserver network. Run 1..n instances on different hosts. Every node will query the discovery service for peers and attempt to initialize a websocket connection to every other node running in the network.

## Usage
Currently you can only test that the connections are formed and messages can be passed to every connected node. Read the run() function defined in index.js for implemented commands.

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
### Production environment
```
npm run start -- --port 10101
```
The port number can be freely selected and does not need to be 10101.
