import os
import logging
import tkinter as tk
from tkinter import ttk
from typing  import Tuple

from logic.message_handler import OrderedMessage #MessageHandler
from services.websocket import WebsocketClient


class ReadOnlyText(tk.Text):
    def __init__(self, *args, **kwargs):
        tk.Text.__init__(self, *args, **kwargs)
        self.bind('<Key>', lambda e: ReadOnlyText.filter_txt_events(e))

    @staticmethod
    def filter_txt_events(event):
        '''
        Kills the event if it's not caused by a ctrl+c.
        '''
        # value of state is apparently different on windows hosts(?),
        # NOT tested for.
        ctrl_pressed_state = 12 if os.name == 'nt' else 4
        if event.state == ctrl_pressed_state and event.keysym == 'c':
            return
        return "break"


class GridFrame(ttk.Frame):
    def __init__(self, master, grid_row, grid_column, grid_columnspan):
        super().__init__(master)
        self.grid(row=grid_row, column=grid_column, columnspan=grid_columnspan, pady=1, padx=1)


class StatusFrame(GridFrame):
    def __init__(self, master, grid_row, grid_column, grid_columnspan):
        super().__init__(master, grid_row, grid_column, grid_columnspan)

        self.__node_label = ttk.Label(self, text='Connected to node:')
        self.__node_label.grid(row=0, column=0, pady=1, padx=1)

        self.__node_info = ttk.Label(self, text='127.0.0.1:8080')
        self.__node_info.grid(row=0, column=1, pady=1, padx=1)

        self.__user_label = ttk.Label(self, text='Name')
        self.__user_label.grid(row=1, column=0, pady=1, padx=1)

        self.__user_entry = ttk.Entry(self, text='Dsatter user')
        self.__user_entry.grid(row=1, column=1, pady=1, padx=1)

        self.__user_set_btn = ttk.Button(self, text='Set username')
        self.__user_set_btn.grid(row=1, column=2, pady=1, padx=1)


class MessagesFrame(GridFrame):
    def __init__(self, master, grid_row, grid_column, grid_columnspan):
        super().__init__(master, grid_row, grid_column, grid_columnspan)

        self.__messages = ReadOnlyText(self)
        self.__messages.pack(side=tk.LEFT, fill=tk.BOTH)
        self.__messages.insert(tk.END, 'No messages.. :(')

        self.__scrollbar = ttk.Scrollbar(self)
        self.__scrollbar.pack(side=tk.RIGHT, fill=tk.BOTH)
        self.__messages.config(yscrollcommand=self.__scrollbar.set)
        self.__scrollbar.config(command=self.__messages.yview)

    def _add_new_message(self, message: OrderedMessage) -> None:
        def formatter(m: OrderedMessage):
            return f'\n{m["dateTime"].strftime("%H:%M")} - {m["sender"]}: {m["text"]}'
        self.__messages.insert(tk.END, formatter(message))
        print('MessageFrame\n--------------\n', message, '\n')


class MessageEntryFrame(GridFrame):
    def __init__(self, master, grid_row, grid_column, grid_columnspan, new_msg_handler: callable):
        super().__init__(master, grid_row, grid_column, grid_columnspan)

        self.__new_msg_handler = new_msg_handler

        self.__label_msg = ttk.Label(self, text='Message:')
        self.__label_msg.grid(row=0, column=0, pady=1, padx=1)

        self.__entry = ttk.Entry(self, width=56)
        self.__entry.grid(row=0, column=1, pady=1, padx=1)
        self.__entry.insert(0, 'Message..')
        self.__entry.configure(state=tk.DISABLED)
        self.__entry.bind('<Return>', self.__on_new_message)
        self.__entry.bind('<Button-1>', self.__on_entry_click)

        self.__button_send = ttk.Button(self, text='Send', command=self.__on_new_message)
        self.__button_send.grid(row=0, column=2, pady=1, padx=1)

    def __on_entry_click(self, event):
        self.__entry.configure(state=tk.NORMAL)
        self.__entry.delete(0, tk.END)
        self.__entry.unbind('<Button-1>')

    def __on_new_message(self, key_event = None):
        message = self.__entry.get()
        if len(message) == 0:
            return

        if self.__new_msg_handler == None:
            logging.error('MessageEntryFrame: Discarding new message, no handler installed')
            return

        self.__new_msg_handler(message)
        self.__entry.delete(0, len(message))


class App(ttk.Frame):
    def __init__(
            self,
            win_title: str,
            #msg_handler: MessageHandler,
            #websocket: WebsocketClient, # TODO: REMOVE REMOVE DELETE
            new_client_msg_handler,
            win_maxsize: Tuple[int, int] = (1024, 1024),
            master: tk.Tk = None) -> 'App':
        super().__init__(master)
        self.master.title(win_title)
        #self.master.minsize(width, height)
        self.master.maxsize(win_maxsize[0], win_maxsize[1])

        #self.__msg_handler = msg_handler
        #self.__wsclient = websocket
        self.__new_client_msg_handler = new_client_msg_handler

        #msg_handler.on_message_event = self.refresh_msgs

        self.pack(pady=1, padx=1)

        self.__init_menu()

        self.__status_frame    = StatusFrame(self, grid_row=0, grid_column=0, grid_columnspan=3)
        self.__messages_frame  = MessagesFrame(self, grid_row=1, grid_column=0, grid_columnspan=3)
        self.__msg_entry_frame = MessageEntryFrame(self, grid_row=2, grid_column=0, grid_columnspan=3, new_msg_handler=self.__new_client_msg_handler)

    def __init_menu(self):
        self.__menu = tk.Menu(self.master)
        self.master.config(menu=self.__menu)

        self.__menuFile = tk.Menu(self.__menu)
        self.__menuFile.add_command(label='Exit', command=self.__quit)
        self.__menu.add_cascade(label='File', menu=self.__menuFile)

        self.__menuEdit = tk.Menu(self.__menu)
        self.__menu.add_cascade(label='Edit', menu=self.__menuEdit)

    def __quit(self):
        print('k thx goodbye')
        self.master.quit()

    def refresh_msgs(self, messages: list) -> None:
        logging.debug('New Message!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')

        print('MESSAGE LIST:', messages)

        for m in messages:
            self.__messages_frame._add_new_message(m)

        #self.__messages.delete('1.0', tk.END)
        #def formatter(m):
        #    return f'{m["timestamp"].strftime("%H:%M")} - {m["sender"]}: {m["message"]}'

        #self.__messages.insert(tk.END, formatter(messages[0]))
        #for m in messages[1:]:
        #    formatted = f'\n{formatter(m)}'
        #    self.__messages.insert(tk.END, formatted)
#
#    def close_window(self):
#        pass
#
#    def close(self):
#        pass


if __name__ == '__main__':
    pass
    #app = App(tk.Tk())
    #app.master.mainloop()
