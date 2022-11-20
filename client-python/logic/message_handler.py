import logging
import threading
import queue
import datetime
import uuid # id = uuid.uuid4()
from typing import Union

class OrderedMessage:

    def __init__(self, message: dict) -> 'OrderedMessage':
        self.__message = message


    @property
    def message(self) -> dict:
        return self.__message


    def __lt__(self, other: 'OrderedMessage') -> bool:
        return self.__message['timestamp'] < other.__message['timestamp']


    def __str__(self) -> str:
        return 'Message: ' + '\n'.join((
            f'ID: {str(self.__message["id"])}',
            f'Time: {self.__message["timestamp"]}',
            f'Sender: {self.__message["sender"]}',
            f'Message: {self.__message["message"]}'
        ))



class MessageHandler(threading.Thread):
    '''
    A class that extends the threading.Thread class. The thread is NOT run
    as a daemon.
    '''

    def __init__(self) -> 'MessageHandler':
        super().__init__()
        self.__message_queue = queue.Queue()
        self.__messages = queue.PriorityQueue()
        self.__on_message_event: callable = None
        self.__continue = True


    @property
    def on_message_event(self) -> callable:
        return self.__on_message_event

    @on_message_event.setter
    def on_message_event(self, func: callable) -> None:
        logging.debug('Message handler installed')
        self.__on_message_event = func


    def run(self) -> None:
        '''
        This method is called by threading.Thread.start method.
        The 'main' function of the thread.
        '''

        logging.debug('Message handler thread initialized')

        while self.__continue:
            self.__continue = self.handle_message_event()

        logging.debug('Message handler thread stopping')


    def create_message(self, message: Union[str, None]) -> None:
        '''
        Append a new message to the queue. This thread will stop
        if message is None. This function never blocks, only logs
        error messages if there is any exceptions when attempting to
        add messages to the queue.
        '''

        if message is not None:
            logging.debug(f'Creating message: {message}')
            if len(message) == 0:
                return

            ordered_msg = OrderedMessage({
                'id': uuid.uuid4(),
                'timestamp': datetime.datetime.now(),
                'sender': 'Test Tester',
                'message': message
            })

            logging.debug(f'ordered message: {ordered_msg.message["message"]}')

        try:
            self.__message_queue.put(
                ordered_msg if message is not None else None,
                block=False
            )
        except queue.Full as e:
            logging.error('Messages queue is full, not handeled:', e)
        except Exception as e:
            logging.error('Exception happened when attempting to add message to the queue: ', e)


    def handle_message_event(self) -> bool:
        logging.debug('Handling message')

        msg = self.__message_queue.get()
        if msg is None:
            return False


        self.__messages.put(msg)

        # NOTE: Python priority queues are implemented as binary heap data structure,
        #       so printing the raw elements in the internal queue does not follow the
        #       ordering in the priority queue.
        #logging.debug(f'messages {[ m.message for m in self.__messages.queue ]}')

        if self.__on_message_event is None: return

        logging.debug('Calling callback')
        self.__on_message_event([ m.message for m in self.__messages.queue ])
        return True
