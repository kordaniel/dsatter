# dsatter
Distributed Systems course project

## Environment setup
```
git clone git@github.com:kordaniel/dsatter.git
cd node-discovery
- follow instructions in README.md
cd node-server
- follow instructions in README.md
```
node discovery service must be running before attempting to run the node-server instances or clients.

Setting up Dockerized environment:
```
./build-images.sh
./start-containers.sh
```
Tearing down the Dockerized environment:
```
./teardown.sh
```
If you wish to only stop running containers, delete the images or volumes, the following commands accomplish those respective actions:
```
./stop-containers.sh
./delete-images.sh
./delete-volumes.sh
```


## Nodes
### Node discovery service
Defined in the directory `node-discovery`.
### Chatserver nodes
Defined in the directory `node-server`.
