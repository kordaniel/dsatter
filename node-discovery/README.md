# Dsatter node discovery service
Provides a REST api for both chatserver nodes and the client applications

## Chatserver nodes
Query for a list of active nodes. Register and unregister own activity.
```
GET  localhost:8080/api/nodes/active
POST localhost:8080/api/nodes/active/register
POST localhost:8080/api/nodes/active/unregister
```

## Client applications
Query for a list of active chatserver nodes, with suggestion of specific node to connect to.
```
GET localhost:8080/api/clients
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
### Production environment
```
npm run start
```
