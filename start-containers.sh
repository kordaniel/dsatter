docker network create dsatter
docker run -p 8080:8080 --mount type=volume,source=ds-vol-dvry,target=/db --net dsatter --name dsatter-discovery -d --rm dsatter-discovery
sleep 2
docker run -p 10101:10101 --mount type=volume,source=ds-vol-1,target=/db --net dsatter --expose 10101 --name dsatter-server-1 -i -t -d dsatter-server --nodeservport=10101
sleep 2
docker run -p 10102:10102 --mount type=volume,source=ds-vol-2,target=/db --net dsatter --expose 10102 --name dsatter-server-2 -i -t -d dsatter-server --nodeservport=10102
sleep 2
docker run -p 10103:10103 --mount type=volume,source=ds-vol-3,target=/db --net dsatter --expose 10103 --name dsatter-server-3 -i -t -d dsatter-server --nodeservport=10103
