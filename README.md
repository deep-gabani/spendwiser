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


### init.sh
It takes more than a minute every time I want to start working on the spendwiser development - I need to start the app, server, swagger, etc.

`init.sh` is a bash script which does that in a single-word command for me.

It is configured to open & start the app, server, swagger UI. It also runs the `git status` for me to get upto the speed quickly. I can run this script by this command:
```bash
. ./init.sh
```

But I didn't want to run this script from the command line everytime so I added an alias to `~/bashrc`.
```bash
alias spendwiser='cd $HOME/personal_projects/spendwiser && . ./init.sh'
```
Now I just need to run `spendwiser` and the magic happens.


### Start the server locally

To start the server locally run the following commands:
```bash
cd server
pip install -r requirements.txt
pip install -r local/requirements.txt
python3 -m local.main
```
The server also starts a Swagger UI at [http://localhost:5000/api](http://localhost:5000/api) which provides a nice interface & documentation for the APIs and also lets one call & play around with APIs.

The above server also starts a local tunnel which provides a random https URL which one can find in the logs agains **Tunnel URL** for the react-native application to connect to.


### Deployment
To deploy the server on AWS lambda function, run the following commands:
```bash
bash deploy_lambda_function.sh aws/lambda/process-expense-image/
```
This will create a new docker image with the installed dependencies and the codebase for the lambda function that you have provided in the argument.

`deploy_lambda_function` script creates a docker image with the source code in `src/` and the `Dockerfile` specified in the `aws/lambda/<function-name>` directory.

Then it takes this docker image and pushes it to the `acr` at `<account-id>.dkr.ecr.<region>.amazonaws.com/tmp:<function-name>`.
Since the lambda function's docker image URI is specified the same - with the tag based symentics, the function will execute with the updated Docker image.

Cool, right!

###### Note: You need to configure aws-cli to run this script properly. Run below commands to configure aws & docker:
```bash
sudo apt-get install awscli
aws configure
aws ecr get-login-password --region <region> | sudo docker login --username AWS --password-stdin <account-id>.dkr.ecr.<region>.amazonaws.com
```
