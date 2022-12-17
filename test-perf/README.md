# Python dsatter client
Test message througput of the distributed chat service. Opens a specified amount of websocket connections to one single server node, prepares all messages that are to be sent evenly distributed over all the websockets. In addition opens one single websocket connection for every running node-server, that is only used for receiving messages back.

## Environment setup
This script has been developed using python version 3.8.10.
```
python3 -m venv venv
source venv/bin/activate
python -m pip install -r requirements.txt
...
deactivate (exit virtual environment)
```

## Running
First set up the virtual environment. After this start discovery-node and 2..n server-nodes. Modify the hardcoded values in main:test_troughput() if you want to alter the max amount of messages or number of sending threads.
Run with:
```
./main.py
```
### Sample run result:
 - In total 3 server-nodes running in the distributed system 
 - 3 Websocket connection to one server-node for pushing messages

Do note that the Sending time printed is simply the time it took to call the websockets send_message methods for all messages. It does not mean that the messages actually left any buffer.

```
Push threads started, n = 3
Recv threads started, n = 3
Initialized 10000 json message objects, sleeping for 1s to ensure connections are open

----------------------------------------------------------------------
Pushing 10 messages over 3 WS connections to one node
Expecting to receive a total of 60 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      10 messages
Received:  60 messages
Total:     0.10059571266174316 seconds
Sending:   0.001461029052734375 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 100 messages over 3 WS connections to one node
Expecting to receive a total of 600 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      100 messages
Received:  600 messages
Total:     0.2351515293121338 seconds
Sending:   0.008749246597290039 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 1000 messages over 3 WS connections to one node
Expecting to receive a total of 6000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      1000 messages
Received:  6000 messages
Total:     1.5669713020324707 seconds
Sending:   0.036360979080200195 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 2000 messages over 3 WS connections to one node
Expecting to receive a total of 12000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      2000 messages
Received:  12000 messages
Total:     3.771900177001953 seconds
Sending:   0.0514986515045166 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 4000 messages over 3 WS connections to one node
Expecting to receive a total of 24000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      4000 messages
Received:  24000 messages
Total:     7.450632095336914 seconds
Sending:   0.07862067222595215 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 8000 messages over 3 WS connections to one node
Expecting to receive a total of 48000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      8000 messages
Received:  48000 messages
Total:     13.573309421539307 seconds
Sending:   0.13310623168945312 seconds
-----------------------------------------------------------------------------------
Done..
```
