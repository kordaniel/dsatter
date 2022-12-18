/* eslint-disable no-console */

const testData = require('../../utils/test-data')

class ChatDao {

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    this.chats = null
    console.log('Mock database table Chats created')
  }

  createTableOwnChats = () => {
    this.chats = testData.chats
  }

  createTableOutsideChats = () => {
    this.chats = testData.chats
  }

  getAllChats = () => {
    return Promise.resolve(this.chats)
  }

  getChat = (chatId) => {
    return Promise.resolve(this.chats.filter((c) => c.chatId === chatId)[0])
  }

}

module.exports = ChatDao
