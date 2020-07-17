#!/bin/bash
echo -e "starting script"

# get the virtualbox ip
export VIRTUALBOX_IP=$(docker-machine ip)
export VIRTUALBOX_USER=docker
export VIRTUALBOX_PASSWORD=tcuser

export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=aA123456
export POSTGRES_PORT=5432
export POSTGRES_DATABASE=test
export DB_MAX_CLIENTS=20
export DB_IDLE_TIMEOUT_MS=30000
export POSTGRES_HOST=$VIRTUALBOX_IP
export POSTGRES_PASSWORD=aA123456

# print database host
echo "POSTGRES_HOST="$POSTGRES_HOST

# ssh to docker machine
# docker_machine_name=$VIRTUALBOX_IP
# docker_ssh_user=$VIRTUALBOX_USER
# docker_ssh_key=$(docker-machine.exe inspect --format={{.Driver.SSHKeyPath}})
# docker_ssh_port=$(docker-machine.exe inspect --format={{.Driver.SSHPort}})

# echo "docker_ssh_user"$docker_ssh_user
# echo "docker_ssh_key"$docker_ssh_key
# echo "docker_ssh_port"$docker_ssh_port

# scp -i $docker_ssh_key -P $docker_ssh_port docker-compose.yml $docker_ssh_user@localhost:/c/dev/sdn-thessis
# ssh -i $docker_ssh_key -p $docker_ssh_port $docker_ssh_user@localhost "docker-compose.exe up -d"

# remove all images
# for image in $(docker images | awk '{print $3}')
# do
#    docker rmi -f $image
# done

# echo "docker compose down"
# docker-compose.exe down

# if [ $1 = "build" ]; then
#     echo "docker compose build"    
#     docker-compose.exe build    
# else

docker-compose.exe up -d

# show all images in the current machine
# docker images

