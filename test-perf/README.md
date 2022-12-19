# Python performance test
Test for the message througput of the distributed chat service.

Opens a specified amount of websocket connections to one single server node, that are used to push test messages to the node. In addition opens one single websocket connection to every node-server running in the distributed system that are never sent to.

Prepares a specified amount of message objects, sends all the messages to one node-server, evenly distributed over all the websocket connections used for pushing. After this, the test measures the time until all messages have been sent back over all the websocket connections.

Since the distributed chat service pushes all the incoming messages to every connected server node, and every server node conveys all incoming messages to every connected client, the number of received messages equals *m * (s + n)*, where *n* is the number of running node-servers, *s* is amount of sockets used for pushing to one node server, and *m* is the number of messages sent.

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
First set up the virtual environment. After this, start the discovery-node and 2...*n* server-nodes. You can modify the hardcoded values in main:test_troughput() if you want to alter the max amount of messages or the number of the sending threads.

Run with:
```
source venv/bin/activate
./main.py
```

### Sample run result:
 - In total 3 server-nodes running in the distributed system 
 - 3 Websocket connections to one server-node for pushing messages (simulating 3 clients, all connected to the same node-server)

Note that the sending time printed is simply the time it took to call the websockets send_message methods for all messages. It does not mean that the messages actually left any buffer.

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
Total:     0.03590989112854004 seconds
Sending:   0.000942230224609375 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 100 messages over 3 WS connections to one node
Expecting to receive a total of 600 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      100 messages
Received:  600 messages
Total:     0.16679930686950684 seconds
Sending:   0.007173776626586914 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 1000 messages over 3 WS connections to one node
Expecting to receive a total of 6000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      1000 messages
Received:  6000 messages
Total:     1.1712450981140137 seconds
Sending:   0.07190108299255371 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 2000 messages over 3 WS connections to one node
Expecting to receive a total of 12000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      2000 messages
Received:  12000 messages
Total:     2.2411670684814453 seconds
Sending:   0.11644601821899414 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 4000 messages over 3 WS connections to one node
Expecting to receive a total of 24000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      4000 messages
Received:  24000 messages
Total:     4.062510251998901 seconds
Sending:   3.790616512298584 seconds
-----------------------------------------------------------------------------------

----------------------------------------------------------------------
Pushing 8000 messages over 3 WS connections to one node
Expecting to receive a total of 48000 responses from all 3 active nodes
-----------------------------------------------------------------------
In total:
Sent:      8000 messages
Received:  48000 messages
Total:     6.992125034332275 seconds
Sending:   0.5246598720550537 seconds
-----------------------------------------------------------------------------------
Done..
```
