# dsatter
Distributed Systems course project

## Setting up environment
```
git clone git@github.com:kordaniel/dsatter.git
npm install
```

## Nodes
### Node discovery service
Provides an REST api for querying and (un/)registering active nodes statuses. Must be started before the chatserver nodes.
```
GET  localhost:8080/api/nodes/active
POST localhost:8080/api/nodes/active/register
POST localhost:8080/api/nodes/active/unregister
```
### Chatserver nodes
No error handling implemented. Currently connections are not always terminated properly in both ends. 1..n nodes can be started and they will open a connection between every running node.

## Dev environment
### Configured commands
Currently one configured npm project in the directory `node-server`.
### Dev environment
```
npm run lint
```
#### Node discovery service
```
npm run discovery
```
#### Chatserver nodes
```
npm run cs            - uses nodemon
npm run chatserver    - terminates normally
```
