#!/bin/bash

# Check if a command line argument was provided
if [ $# -eq 0 ]; then
  echo "Error: No lambda function provided in the command line argument!"
  echo -e "Provide path to the lambda function. exmaple command: \033[3m\033[1;32msudo bash deploy_lambda_function.sh aws/lambda_function/process-expense-image\033[1;32m\033[3m"
  exit 1
fi

# Assign the command line argument to a variable
lambda_function_directory=$1

# Print the argument to the console
echo "lambda_function_directory is: $lambda_function_directory"

# Copying required files...
cp requirements.txt $lambda_function_directory
rsync -r --exclude '__pycache__' src $lambda_function_directory

cd $lambda_function_directory

# Create a fresh docker image
docker_name=$(basename "$lambda_function_directory")
sudo docker build -t $docker_name .

# Pushing the image to acr...
sudo docker tag $docker_name \
    426469431555.dkr.ecr.ap-south-1.amazonaws.com/tmp:$docker_name
sudo docker push \
    426469431555.dkr.ecr.ap-south-1.amazonaws.com/tmp:$docker_name

# Cleaning up...
rm -r requirements.txt src
