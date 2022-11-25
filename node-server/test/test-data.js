class TestData {
chats
messages

  constructor() {
    /**@type {Chat[]} */
    this.chats = [
      {
        nodeId: 1,
        id: 1,
        chatId: 11,
        name: 'important chat'
      },
      {
        nodeId: 2,
        id: 1,
        chatId: 21,
        name: 'less important chat'
      }
    ]

    /**@type {Message[]} */
    this.messages = [
      {
        nodeId: 1,
        id: 1,
        text: 'this is the first message to the first chat',
        dateTime: current.toLocaleString([], {hour12: false}),
        sender: 'Julia',
        chatId: 11
      },
      {
        nodeId: 1,
        id: 2,
        text: 'this is the first message to another chat',
        dateTime: current.toLocaleString([], {hour12: false}),
        sender: 'Julia',
        chatId: 21
      },
      {
        nodeId: 2,
        id: 1,
        text: 'this message is from another node to the first chat',
        dateTime: current.toLocaleString([], {hour12: false}),
        sender: 'Jaana',
        chatId: 11
      },
      {
        nodeId: 2,
        id: 2,
        text: 'this message is from another node to the second chat',
        dateTime: current.toLocaleString([], {hour12: false}),
        sender: 'Jaana',
        chatId: 21
      }
    ]
  }

  getChat(chatId) {
    return Promise.resolve(this.chats.filter((c) => c.chatId == chatId))
  }

  getMessages(chatId) {
    return Promise.resolve(this.messages.filter((m) => m.chatId == chatId))
  }

  addNewChat(chat) {
    newChats = [...this.chats, chat]
    return Promise.resolve(this.chats)
  }

  addNewMessage(message) {
    return Promise.resolve(this.messages)
  }

}