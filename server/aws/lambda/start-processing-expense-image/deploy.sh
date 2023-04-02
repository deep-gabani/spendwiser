#!/bin/bash

docker_name="start-processing-expense-image"
function_name="start-processing-expense-image"
ecr_repo="spendwiser"

# Create a fresh docker image
sudo docker build -t $docker_name .

# Pushing the image to acr...
sudo docker tag $docker_name \
    426469431555.dkr.ecr.ap-south-1.amazonaws.com/$ecr_repo:$docker_name
sudo docker push \
    426469431555.dkr.ecr.ap-south-1.amazonaws.com/$ecr_repo:$docker_name

aws lambda update-function-code \
    --function-name $function_name \
    --image-uri 426469431555.dkr.ecr.ap-south-1.amazonaws.com/$ecr_repo:$docker_name
