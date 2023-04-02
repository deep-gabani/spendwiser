# spendwiser

A personal expense tracker application


## Development

### Run the application

Go to the repo directory and run below commands:
```bash
cd app
npm i
npm run start
```


### Server

Our architecture is serverless.
It has AWS lambda functions that are being called upon hitting APIs on the AWS API Gateway.

#### Lambda functions

We total have below lambda functions:
- process-expense-image
    - API corresponding to it:
        - **None**
            - This lambda function is called asynchronously by `start-processing-expense-image` lambda function.
            - Processing the expense image can vary from image to image depending on various parameters. So, this lambda function is dedicated to running the core logic and not worry about API response time or data size, etc.
    - Description:
        - It contains the core business logic of processing the image and extracting the expense details from it.
        - It will update the DB with the extracted expense details at the end.
- start-processing-expense-image
    - API corresponding to it:
        - POST **/start-processing-expense-image**
    - Description:
        - When the user submit the expense image in the app, the app will upload the expense image to S3 bucket and get the image URI.
        - The app will then call this function to trigger the processing of the expense image.
        - This function will in turn call `process-expense-image` lambda function asyncronously and respond with the message that the extraction has begun.
- user
    - API corresponding to it:
        - POST **/signup**
        - POST **/login**
        - POST **/send-otp**
    - Description:
        - This function is designed to handle all user related services.


## Deployment
To deploy the server on AWS lambda function, there is a `deploy.sh` script in each directories at `server/aws/lambda/*/`:
This script will create a fresh docker image with the current changes, push it to the ECR repository, and re-deploy the lambda function to use the updated docker image.
Each function's docker image is tagged with that function's name to better navigate.

To deploy all the AWS lambda functions together, run `deploy_all_lambda_functions.sh` script using below command:
```bash
bash deploy_all_lambda_functions.sh
```

Cool stuff!


#### Note: You need to configure aws-cli to run above scripts properly. Run below commands to configure aws & docker:
```bash
sudo apt-get install awscli
aws configure
aws ecr get-login-password --region <region> | sudo docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```
