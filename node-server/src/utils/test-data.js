/**
 * @typedef {import(../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../common/types/datatypes).Message} Message
 * @typedef {import(../../common/types/datatypes).RegisteredNode} RegisteredNode
 */
const current = new Date()

/**@type {Chat[]} */
const chats = [
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
const messages = [
  {
    nodeId: 1,
    id: 1,
    messageId: 11,
    text: 'this is the first message to the first chat',
    dateTime: current.toLocaleString([], { hour12: false }),
    sender: 'Julia',
    chatId: 11
  },
  {
    nodeId: 1,
    id: 2,
    messageId: 12,
    text: 'this is the first message to another chat',
    dateTime: current.toLocaleString([], { hour12: false }),
    sender: 'Julia',
    chatId: 21
  },
  {
    nodeId: 2,
    id: 1,
    messageId: 21,
    text: 'this message is from another node to the first chat',
    dateTime: current.toLocaleString([], { hour12: false }),
    sender: 'Jaana',
    chatId: 11
  },
  {
    nodeId: 2,
    id: 2,
    messageId: 22,
    text: 'this message is from another node to the second chat',
    dateTime: current.toLocaleString([], { hour12: false }),
    sender: 'Jaana',
    chatId: 21
  }
]

/**@type {RegisteredNode[]} */
const nodes = [
  {
    id: 1,
    password: 'veryS1krit'
  },
  {
    id: 2,
    password: 'birthdayIsPasswd'
  }
]

module.exports = {
  chats,
  messages,
  nodes
}
