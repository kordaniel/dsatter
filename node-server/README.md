# Dsatter chat server node
Every started instance will register itself and report it's status to the discovery service.

Every started instance will open a bi-directional listening socket for WS connections from both other node-server instances as well as from the clients. When a new node-server joins the network it will connect to every already running instance and thus a strongly connected mesh is formed between all the running node-servers.

Every node has it's own database and synchronization is done between the running instances, so all the running nodes share the same global state.

Run 1...*n* instances on different sockets/hosts.

## Environment setup
```
npm install
```

## Configured commands
### Development environment
When running on localhost with NODE_ENV=development, you must specify the db-path to use:
```
npm run dev -- --dbpath=<PATH_TO_FILE.db>
npm run lint
```
### Test environment
```
npm run test
```
### Production environment
When running in containers with NODE_ENV=production, you must specify the port to listen to for the other nodes' websocket connections:
```
npm run start -- --nodeservport=10101
```
The port number can be freely selected and does not need to be 10101.


## Usage
When running in the production mode the node-servers will only print events to stdout. When running in the development environment we provide a simple ui to aid debugging.

### Terminal commands in the dev environment
```
bs       - Broadcast a string to every connected node-server
bc       - Broadcast a string to every connected client
status   - Print status of open and connected sockets
dump     - Print all rows in the running nodes local messages database
pm       - Push a random test message to the running node's database
pc       - Push a random message from the DB to all connected clients
quit     - Shutdown the local node
```
