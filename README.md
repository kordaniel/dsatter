# dsatter
Distributed Systems course project

## Setting up environment
```
git clone git@github.com:kordaniel/dsatter.git
npm install
```

## Nodes
### Node discovery service
Provides an REST api for querying and (un/)registering active nodes statuses.
```
GET  localhost:8080/api/nodes/active
POST localhost:8080/api/nodes/active/register
POST localhost:8080/api/nodes/active/unregister
```
### Chatserver nodes
TODO

## Configured commands
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
npm run dev
npm run start
```

### Production environment
#### Chatserver nodes
```
npm run start
```
