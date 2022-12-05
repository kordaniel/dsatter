# Dsatter node discovery service
Provides a REST api for both chatserver nodes and the client applications

## Chatserver nodes
###
Register a new node
```
POST localhost:8080/api/nodes/register
```
### Active online nodes
Query for a list of active nodes. Login and logout running node-servers.
```
GET  localhost:8080/api/nodes/active
POST localhost:8080/api/nodes/active/login
POST localhost:8080/api/nodes/active/logout
```

## Client applications
Query for a list of active chatserver nodes. The returned list is sorted (randomly for now) so that the client should always prefer the first chatserver node in the list that accepts the connection.
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
