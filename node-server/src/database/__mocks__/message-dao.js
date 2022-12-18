/* eslint-disable no-console */

const testData = require('../../utils/test-data')
const {
  concatenateIntegers
} = require('../../../../common/utils/helpers')

class MessageDao {

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    this.chats = null
    this.messages = null
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
      .filter(m => m.nodeId === nodeId)

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

  addOwnMessage = async (message) => {
    message.id = await this.generateMessageId()
    message.messageId = concatenateIntegers(message.nodeId, message.id)
    const newMessages = [...this.messages, message]
    this.messages = newMessages
    return Promise.resolve(message)
  }

  addOutsideMessage = (message) => {
    const newMessages = [...this.messages, message]
    this.messages = newMessages
    return Promise.resolve(message)
  }

  generateMessageId = async (nodeId) => {
    const prevMax = await this.getLastMessageId(nodeId)

    return prevMax === null
      ? 1
      : 1 + (prevMax.maxId ? prevMax.maxId : 0)
  }
}

module.exports = MessageDao
