/* eslint-disable no-console */

const testData = require('../../utils/test-data')

class MessageDao {
  chats
  messages

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    console.log('Mock database table Messages created')
  }

  createTableOwnMessages = () => {
    this.messages = testData.messages
  }

  createTableOutsideMessages = () => {
    this.messages = testData.messages
  }

  getAllMessages = () => {
    return Promise.resolve(this.messages)
  }

  getMessagesWithNodeId = (nodeId) => {
    return Promise.resolve(this.messages
      .filter(m => m.nodeId === nodeId))

  }

  getLastMessageId = (nodeId) => {
    const nodeMessages = this.messages
      .filter(m => m.nodeId === nodeId && maxIdMsg())

    if (nodeMessages.length === 0) {
      return Promise.resolve(null)
    }
    const maxIdMsg = nodeMessages.reduce((prev, cur) => {
      return prev.id > cur.id ? prev : cur
    })
    return Promise.resolve({ maxId: maxIdMsg.id })
  }

  getMessage = (messageId) => {
    return Promise.resolve(this.messages.filter((m) => m.messageId === messageId)[0])
  }

  getMessages = (chatId) => {
    return Promise.resolve(this.messages.filter((m) => m.chatId === chatId))
  }

  addOwnMessage = (message) => {
    const newMessages = [...this.messages, message]
    this.messages = newMessages
    return Promise.resolve(this.messages)
  }

  addOutsideMessage = (message) => {
    const newMessages = [...this.messages, message]
    this.messages = newMessages
    return Promise.resolve(this.messages)
  }
}

module.exports = MessageDao
