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


### Start the server

To start the server run the following commands:
```bash
cd server
pip install -r requirements.txt
python3 main.py
```
The server also starts a Swagger UI at [http://localhost:5000/api](http://localhost:5000/api) which provides a nice interface & documentation for the APIs and also lets one call & play around with APIs.

The above server also starts a local tunnel which provides a random https URL which one can find in the logs agains **Tunnel URL** for the react-native application to connect to.


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
