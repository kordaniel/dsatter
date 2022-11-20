import sys, os
sys.path.append(os.path.dirname(os.path.dirname(os.path.realpath(__file__))))

import logging
import tkinter as tk
from tkinter import ttk
from typing  import Tuple

from logic.message_handler import MessageHandler
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


class App(ttk.Frame):
    def __init__(
            self,
            win_title: str,
            msg_handler: MessageHandler,
            websocket: WebsocketClient, # TODO: REMOVE REMOVE DELETE
            win_maxsize: Tuple[int, int] = (1024, 1024),
            master: tk.Tk = None) -> 'App':
        super().__init__(master)
        self.master.title(win_title)
        #self.master.minsize(width, height)
        self.master.maxsize(win_maxsize[0], win_maxsize[1])

        self.__msg_handler = msg_handler
        self.__wsclient = websocket

        msg_handler.on_message_event = self.refresh_msgs

        self.pack(pady=1, padx=1)
        self.__init_menu()
        self.__init_messages_view([])
        self.__init_entry()

    def __init_menu(self):
        self.__menu = tk.Menu(self.master)
        self.master.config(menu=self.__menu)

        self.__menuFile = tk.Menu(self.__menu)
        self.__menuFile.add_command(label='Exit', command=self.__quit)
        self.__menu.add_cascade(label='File', menu=self.__menuFile)

        self.__menuEdit = tk.Menu(self.__menu)
        self.__menu.add_cascade(label='Edit', menu=self.__menuEdit)

    def __init_messages_view(self, messages: list):
        self.__messages_frame = ttk.Frame(self)
        self.__messages_frame.grid(row=0, column=0, columnspan=3, pady=1, padx=1)

        self.__messages = ReadOnlyText(self.__messages_frame)
        self.__messages.pack(side=tk.LEFT, fill=tk.BOTH)

        self.__messages.insert(tk.END, 'No messages.. :(')

        self.__scrollbar = ttk.Scrollbar(self.__messages_frame)
        self.__scrollbar.pack(side=tk.RIGHT, fill=tk.BOTH)
        self.__messages.config(yscrollcommand=self.__scrollbar.set)
        self.__scrollbar.config(command=self.__messages.yview)

    def __on_entry_click(self, event):
        self.__entry.configure(state=tk.NORMAL)
        self.__entry.delete(0, tk.END)
        self.__entry.unbind('<Button-1>')

    def __init_entry(self):
        self.__label_msg = ttk.Label(self, text='Message:')
        self.__label_msg.grid(row=1, column=0, pady=1, padx=1)

        self.__entry = ttk.Entry(self, width=56)
        self.__entry.grid(row=1, column=1, pady=1, padx=1)
        self.__entry.insert(0, 'Message..')
        self.__entry.configure(state=tk.DISABLED)
        self.__entry.bind('<Return>', self.append_msg)
        self.__entry.bind('<Button-1>', self.__on_entry_click)

        self.__button_send = ttk.Button(self, text='Send', command=self.append_msg)
        self.__button_send.grid(row=1, column=2, pady=1, padx=1)


    def __quit(self):
        print('k thx goodbye')
        self.master.quit()


    def append_msg(self, key_event = None):
        message = self.__entry.get()
        if len(message) == 0:
            return

        self.__wsclient.send_message(message)

        self.__msg_handler.create_message(message)
        self.__entry.delete(0, len(message))


    def refresh_msgs(self, messages: list) -> None:
        logging.debug('New Message!!!!!!!!')
        self.__messages.delete('1.0', tk.END)
        def formatter(m):
            return f'{m["timestamp"].strftime("%H:%M")} - {m["sender"]}: {m["message"]}'

        self.__messages.insert(tk.END, formatter(messages[0]))
        for m in messages[1:]:
            formatted = f'\n{formatter(m)}'
            self.__messages.insert(tk.END, formatted)

    def close_window(self):
        pass

    def close(self):
        pass


if __name__ == '__main__':
    pass
    #app = App(tk.Tk())
    #app.master.mainloop()
