# dsatter

## Setting up environment
```
git clone git@github.com:kordaniel/dsatter.git
npm install
```
## Configured commands
### Dev environment
```
npm run dev
npm run lint
npm run start
```
### Production environment
```
npm run start
```

## Setting up dockerized server
```
cd node-server
docker build -t dsatter-server .
docker run -p 10101:10101 -d --rm dsatter-server
```

Distributed Systems course project
