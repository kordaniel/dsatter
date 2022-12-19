/**
 * @typedef {import(../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../common/types/datatypes).Message} Message
 * @typedef {import(../../common/types/datatypes).RegisteredNode} RegisteredNode
 */
const current = new Date()

/**@type {Chat[]} */
const chats = [
  {
    nodeId: 1001,
    id: 1,
    chatId: 11,
    name: 'important chat'
  },
  {
    nodeId: 1002,
    id: 1,
    chatId: 21,
    name: 'less important chat'
  }
]


/**@type {Message[]} */
const messages = [
  {
    nodeId: 1001,
    id: 1,
    messageId: 10011,
    text: 'this is the first message to the first chat',
    dateTime: current.toJSON(),
    sender: 'Julia',
    chatId: 11
  },
  {
    nodeId: 1001,
    id: 2,
    messageId: 10012,
    text: 'this is the first message to another chat',
    dateTime: current.toJSON(),
    sender: 'Julia',
    chatId: 21
  },
  {
    nodeId: 1002,
    id: 1,
    messageId: 10021,
    text: 'this message is from another node to the first chat',
    dateTime: current.toJSON(),
    sender: 'Jaana',
    chatId: 11
  },
  {
    nodeId: 1002,
    id: 2,
    messageId: 10022,
    text: 'this message is from another node to the second chat',
    dateTime: current.toJSON(),
    sender: 'Jaana',
    chatId: 21
  }
]

/**@type {RegisteredNode[]} */
const nodes = [
  {
    id: 1001,
    password: 'veryS1krit'
  },
  {
    id: 1002,
    password: 'birthdayIsPasswd'
  }
]

module.exports = {
  chats,
  messages,
  nodes
}
