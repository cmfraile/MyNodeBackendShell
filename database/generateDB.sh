#docker volume prune;
#docker network prune;
#docker network create --subnet 172.10.0.0/24 --gateway 172.10.0.1 yourProjectDatabaseNet;
#docker rm -f database;

docker run -d --name database -p 27017:27017 --ip=172.10.0.2 --network=yourProjectDatabaseNet --restart=always \
-v /home/yourUser/yourProjectStorage/database:/data/db \
-e "MONGO_INITDB_ROOT_USERNAME=example" -e "MONGO_INITDB_ROOT_PASSWORD=example" \
mongo:latest ;
docker exec -it DB bash;

# Tras desplegar el contenedor:

# mongosh -u example -p example ;
# use database;
# Dentro de la BD:
# db.createUser({user:'example',pwd:'example',roles:['readWrite']}) ;