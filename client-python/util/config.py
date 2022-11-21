import os
import logging

from util.helpers import maptextfile


class Configuration:

    CONF = dict()

    @staticmethod
    def parse_load_js_constants(filename: str) -> dict:
        def parse_dict_pairs(el: tuple):
            key = el[0].strip()
            val = el[1].strip()
            try:
                return key, int(val)
            except ValueError as e:
                return key, val
            except Exception as e:
                logging.fatal('ERROR parsing config file')
                raise e


        def strip_ending_comments(line: str) -> str:
            i = len(line) - 1

            while i > 0:
                if line[i] in ('\'', '"', '`'): break # stop at last quotation char for simplicity
                elif line[i] == '/' and line[i-1] == '/': return line[:i-1] # line ends with js comment
                i -= 1

            return line


        config_js_rows = maptextfile(os.path.abspath(filename))

        config = map(lambda r: r.strip(), config_js_rows)
        config = filter(lambda r: r.startswith('const'), config)
        config = map(lambda r: r[len('const'):], config)
        config = map(strip_ending_comments, config)
        config = map(lambda r: r.replace('\'', '').replace('"', ''), config)
        config = map(lambda r: r.split('='), config)
        config = map(parse_dict_pairs, config)

        for key, val in config:
            if isinstance(val, int) or val.count('`') < 2:
                Configuration.CONF[key] = val
            else:
                logging.info('Loading config: Encountered a row that contains over 1 backtiks. Assuming template string.')
                logging.info(f'Ignoring the parsed line with the contents: key=[[{key}]] and val=[[{val}]]')

        return Configuration.CONF
