# Dsatter node discovery service
Provides a REST api for both chatserver nodes and the client applications

## Chatserver nodes
### Register a new node
```json
POST localhost:8080/api/nodes/register
Expected body:
{
  "password": "abcd"
}
Returns:
{
  "id": 4,
  "password": "abcd"
} or { "error": "explanatory string" }
```
### Active online nodes
Query for a list of active nodes. Login and logout running node-servers.
```json
GET  localhost:8080/api/nodes/active
Returns:
{
  "activeNodes": [
    {
      "id": 2,
      "syncport": 41953,
      "clientport": 55006,
      "address": "::ffff:127.0.0.1"
    }
    {
      ..
    },
    ..
  ]
}

POST localhost:8080/api/nodes/active/login
Expected body:
{
  "id": 2,
  "password": "abcd",
  "syncport": 41953,
  "clientport": 55006
}
Returns:
{
  "id": 2,
  "syncport": 41953,
  "clientport": 55006,
  "address": "::ffff:127.0.0.1",
  "activeNodes": [ .. ] // Other active nodes
} or { "error": "explanatory string" }

POST localhost:8080/api/nodes/active/logout
Expected body:
{
  "id": 2,
  "password": "abcd"
}
Returns all other active nodes:
{
  "activeNodes": [
    {
      "id": 3,
      "syncport": 41953,
      "clientport": 55006,
      "address": "::ffff:127.0.0.1"
    },
    {
      ..
    },
    ..
  ]
} or { "error": "explanatory string" }
```

## Client applications
Query for a list of active chatserver nodes. The returned list is sorted (randomly for now) so that the client should always prefer the first chatserver node in the list that accepts the connection.
```
GET localhost:8080/api/clients
```
Returns:
```json
{
  "activeNodes":
    [
      { "address": "<ADDR>", "clientport": <PORT> },
      { .. },
      ..
    ]
}
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
npm run start
```
