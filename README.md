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
python3 apis.py
```
The server also starts a Swagger UI at [http://localhost:5000/api](http://localhost:5000/api) which provides a nice interface & documentation for the APIs and also lets one call & play around with APIs.

The above server also starts a local tunnel which provides a random https URL which one can find in the logs agains **Tunnel URL** for the react-native application to connect to.
