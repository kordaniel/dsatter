const logger    = require('../../../../common/utils/logger')
const testData = require('../../utils/test-data')

class Dao {
  chats
  messages

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    logger.info('Mock database created')
  }

  createTableChats = () => {
    this.chats = testData.chats
  }

  createTableMessages = () => {
    this.messages = testData.messages
  }

  createTableNode = () => {
    this.nodes = testData.nodes
  }

  getChat = (chatId) => {
    return Promise.resolve(this.chats.filter((c) => c.chatId === chatId)[0])
  }

  getMessage = (messageId) => {
    return Promise.resolve(this.messages.filter((m) => m.messageId === messageId)[0])
  }

  getMessages = (chatId) => {
    return Promise.resolve(this.messages.filter((m) => m.chatId === chatId))
  }

  addNewChat = (chat) => {
    const newChats = [...this.chats, chat]
    this.chats = newChats
    return Promise.resolve(this.chats)
  }

  addNewMessage = (message) => {
    const newMessages = [...this.messages, message]
    this.messages = newMessages
    return Promise.resolve(this.messages)
  }
}

module.exports = Dao