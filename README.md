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
npm install -g localtunnel
python3 apis.py
```
The server also starts a Swagger UI at [http://localhost:5000/api](http://localhost:5000/api) which provides a nice interface & documentation for the APIs and also lets one call & play around with APIs.

If the react-native application want to talk to the server APIs, start the tunnel so that there is an url for the server which is running on the port, by running the following command:
```bash
gnome-terminal --tab --title=newTab \\ -- bash -c "lt --port 5000 ;bash"
```
This provides an url Which can be passed on to the react-native application to connect with the APIs.
