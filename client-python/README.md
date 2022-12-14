# Python dsatter client
STUB, for now only a very simple skeleton for the client

## Features
- GUI, by using python standard library tkinter
- Can query REST endpoints, utilizing the requests library

Additional threads:
- Websocket service connects to server (wrong endpoint) and responds to pings, prints messages and send messages, using the websocket-client library.
- Internal message queue, python stdlib queue

## Environment setup
This app has been developed using python version 3.8.10.
```
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt

TO EXIT: deactivate
```
After initializing the environment run with
```
./main.py
```

Commands
```
python3 --version => 3.8.10

python3 -m venv venv
source venv/bin/activate
python -m pip install <package-name>
python -m pip list
python -m pip freeze > requirements.txt
python -m pip install -r requirements.txt
...
deactivate
```
