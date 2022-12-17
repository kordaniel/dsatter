#!/usr/bin/env python3
# This app has been tested with python 3.8.10

import logging, json, time, random

from util.helpers import urlify
from services.rest_client import RESTClient
from services.websocket import WebsocketClient


def create_message(num: int):
        return json.dumps({
            'type': 'newMessageFromClient',
            'payload': {
                'text': f'Test message {num} from client',
                'sender': 'pythonClientUser',
                'chatId': 11
            }
        })


def query_servers():
    node_srv_endpoints = RESTClient.get(urlify(
        'http://localhost',
        '8080',
        'api/clients'
    ))

    if node_srv_endpoints is None:
        logging.info('Discovery node unreachable')
        return None

    return node_srv_endpoints['activeNodes']


def test_troughput(endpoints: list):
    if len(endpoints) < 2:
        print('Unable to test troughput, start discovery service and at least 2 node-servers')
        return

    messages_cnt = 10000
    push_threads_cnt = 3 # All threads push to one single selected server

    serv_push = endpoints[random.randrange(0, len(endpoints))]
    recv_threads_cnt = len(endpoints) # One thread per running server, including the one receiving the messages

    push_threads = [WebsocketClient(f'ws://{urlify(*serv_push.values())}') for _ in range(push_threads_cnt)]
    recv_threads = [WebsocketClient(f'ws://{urlify(*serv_recv.values())}') for serv_recv in endpoints]

    if len(push_threads) != push_threads_cnt or len(recv_threads) != recv_threads_cnt:
        print('Error instantiating threads..')
        return

    for t in push_threads: t.start()
    print('Push threads started, n =', push_threads_cnt)
    for t in recv_threads: t.start()
    print('Recv threads started, n =', recv_threads_cnt)

    test_messages = [create_message(i) for i in range(messages_cnt)]
    print(f'Initialized {messages_cnt} json message objects, sleeping for 1s to ensure connections are open')
    time.sleep(1)

    n = 1 # total num of messages to send over all WS connections to one server-node
    while True:
        n = 10 * n if n < 1000 else 2 * n
        if n > messages_cnt: break

        expected_msg_cnt = n * (push_threads_cnt + recv_threads_cnt)
        for t in push_threads: t.reset_for_tests(expected_inbound_cnt=n) # clear done event, set the expected inbound messages count
        for t in recv_threads: t.reset_for_tests(expected_inbound_cnt=n)

        time.sleep(.5)

        print('\n----------------------------------------------------------------------')
        print(f'Pushing {n} messages over {push_threads_cnt} WS connections to one node')
        print(f'Expecting to receive a total of {expected_msg_cnt} responses from all {recv_threads_cnt} active nodes')
        print('-----------------------------------------------------------------------')

        time_start = time.time()
        for i, m in enumerate(test_messages[:n]):
            push_idx = i % len(push_threads)
            push_threads[push_idx].send_message(m)
        time_sent = time.time() # NOTE: The messages may or may NOT have been sent out to the network at this point

        for t in push_threads: t.done_event.wait() # Wait for every threads done event, which is set when it has
        for t in recv_threads: t.done_event.wait() # received the expected amount of messages

        time_end = time.time()

        total    = time_end  - time_start
        sending  = time_sent - time_start

        total_recv_cnt = sum([ws.recv_counter for ws in recv_threads]) \
                       + sum([ws.recv_counter for ws in push_threads])

        print(f'In total:')
        print(f'Sent:      {sum([ws.sent_counter for ws in push_threads])} messages')
        print(f'Received:  {total_recv_cnt} messages')
        print(f'Total:     {total} seconds')
        print(f'Sending:   {sending} seconds')
        #print(f'Receiving: {finished} seconds')
        #for t in push_threads:
        #    print('push thread done e:', t.done_event.is_set())
        #for t in recv_threads:
        #    print('recv thread done e:', t.done_event.is_set())
        print('-----------------------------------------------------------------------------------')

    for t in push_threads: t.terminate()
    for t in recv_threads: t.terminate()
    for t in push_threads: t.join()
    for t in recv_threads: t.join()
    print('Done..')


def main() -> None:
    pass


def test() -> None:
    test_troughput(query_servers())
    return


if __name__ == '__main__':
    test()
