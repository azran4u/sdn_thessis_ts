#!/bin/bash
echo -e "starting script"

# get the virtualbox ip
VIRTUALBOX_IP=$(docker-machine ip)
echo "VIRTUALBOX_IP="$VIRTUALBOX_IP

# set enviornment variables
export POSTGRES_HOST=$VIRTUALBOX_IP
echo "POSTGRES_HOST="$POSTGRES_HOST
export POSTGRES_PASSWORD=aA123456
echo "POSTGRES_PASSWORD="$POSTGRES_PASSWORD

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

# docker-compose.exe up -d

# show all images in the current machine
# docker images

