# spendwiser

A personal expense tracker application


## Development

### Run the application

Go to the repo directory and run below commands:
```bash
cd app
npm run start
```


### Start the server

To start the server run the following commands:
```bash
cd server
sudo apt install tesseract-ocr libtesseract-dev
pip install -r requirements.txt
npm install -g localtunnel
python3 apis.py
gnome-terminal --tab --title=newTab \\ -- bash -c "lt --port 5000 ;bash"
```
localtunnel will provide a url for the server which is the base API url.
Which can be passed on to the react-native application to connect with the APIs.
