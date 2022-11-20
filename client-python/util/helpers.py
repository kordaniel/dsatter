import logging
from time import sleep

def catch_exception_sleep(timeout, retry = 100):
    def decorator(function):
        def wrapper(*args, **kwargs):
            retries = 0
            while True:
                retries += 1
                try:
                    value = function(*args, **kwargs)
                    return value
                except Exception as e:
                    logging.warning(f'Excepetion occurred: {e}')
                    if retries == retry:
                        logging.debug('Retries limit achieved. Stopping')
                        return None
                    logging.debug(f'Sleeping for {timeout} seconds before retry..')
                    sleep(timeout)
        return wrapper
    return decorator
