/* eslint-disable no-console */
const testData = require('../../utils/test-data')
const logger = require('../../../../common/utils/logger')

class Dao {
  chats
  messages

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    logger.test('Mock database created')
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

  /*
  getNode = () => {
    //return Promise.resolve(this.nodes[0])
  }

  getAllChats = () => {

  }
  */
  getAllMessages = () => {
    return Promise.resolve(this.messages)
  }
  /*
  getMessagesWithNodeId = (nodeId) => {

  }

  addNewNode = (node) => {

  }

  getLastChatId = (nodeId) => {

  }
  */

  getLastMessageId = (nodeId) => {
    const nodeMessages = this.messages
      .filter(m => m.nodeId === nodeId)

    if (nodeMessages.length === 0) {
      return Promise.resolve(null)
    }

    const maxIdMsg = nodeMessages.reduce((prev, cur) => {
      return prev.id > cur.id ? prev : cur
    })

    return Promise.resolve({ maxId: maxIdMsg.id })
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
