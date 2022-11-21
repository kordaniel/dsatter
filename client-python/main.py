#!/usr/bin/env python3
# This app has been tested with python 3.8.10

import logging
from typing import Union
from tkinter import Tk

from util.config import Configuration
from util.helpers import get_parent_directory
from ui.gui import App
from services.rest_client import RESTClient
from services.websocket import WebsocketClient
from logic.message_handler import MessageHandler


CONFIG_JS_SCRIPT_PATH = f'{get_parent_directory(__file__, 1)}/common/utils/config.js'


def urlify(url: str, port: Union[int, str], path: str) -> str:
    return f'{url}:{port}/{path}'

def initialize() -> tuple:
    conf = Configuration.parse_load_js_constants(CONFIG_JS_SCRIPT_PATH)
    # Logging levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
    formatConfig = '[%(asctime)s] [%(levelname)s] %(filename)s:%(lineno)d: %(message)s'

    logging.basicConfig(
        level=logging.DEBUG,
        format=formatConfig
    )

    endpoint = RESTClient.get(urlify(
        Configuration.CONF['NODE_DISCOVERY_URL'],
        Configuration.CONF['NODE_DISCOVERY_PORT'],
        Configuration.CONF['NODE_DISCOVERY_PATH_CLIENT']
    ))

    if endpoint is None:
        logging.info('Discovery node unreachable, exiting')
        return None, None

    endpoint_suggestion = endpoint['suggestedEndpoint']
    #endpoints_all       = endpoint['activeNodes'] # TODO: Use ordered list returned by discovery node

    if endpoint_suggestion == False:
        logging.info('Discovery node failed to suggest node-server WS endpoint, exiting')
        return None, None

    thread_wsclient    = WebsocketClient(f'ws://localhost:{endpoint_suggestion}')
    thread_msg_handler = MessageHandler()

    logging.info('dsatter CLIENT initialized')

    return thread_wsclient, thread_msg_handler


def main() -> None:
    thread_wsclient, thread_msg_handler = initialize()

    if thread_wsclient is None or thread_msg_handler is None:
        return

    root = Tk()

    # TODO: Only pass the needed functions to App (instead of full objects)
    app = App('dsatter Chat Client', thread_msg_handler, thread_wsclient, (1024, 1024), root)

    thread_msg_handler.start()
    thread_wsclient.start()

    app.mainloop()

    thread_msg_handler.create_message(None)
    thread_wsclient.terminate()

    thread_wsclient.join()
    thread_msg_handler.join()

if __name__ == '__main__':
    #print(os.environ)
    main()
