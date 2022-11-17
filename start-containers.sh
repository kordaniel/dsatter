docker network create dsatter
docker run -p 8080:8080 --net dsatter --name dsatter-discovery -d --rm dsatter-discovery
sleep 2
docker run -p 10101:10101 --net dsatter --expose 10101 --name dsatter-server-1 -d --rm dsatter-server 10101
sleep 2
docker run -p 10102:10102 --net dsatter --expose 10102 --name dsatter-server-2 -d --rm dsatter-server 10102
sleep 2
docker run -p 10103:10103 --net dsatter --expose 10103 --name dsatter-server-3 -d --rm dsatter-server 10103
