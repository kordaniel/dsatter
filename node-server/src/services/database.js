const logger    = require('../../../common/utils/logger')
const testData = require('../utils/test-data')
const querier = require('../database/querier')
const Dao = require('../database/dao')

/**
 * @typedef {import('../../../common/utils/types/datatypes).Message} Message
 * @typedef {import('../../../common/utils/types/datatypes).Chat} Chat
 */
class DatabaseService {

  /**
   * Initiates database
   */
  initiateDatabase = async () => {
    querier.initiateDatabase()
  }

  /**
   * Opens connection and initiates tables
   * @param {Querier} q
   */
  openDatabaseConnection = async (d = dao) => {
openDatabaseConnection = async (d = Dao(querier)) => {

    await dao.createTableChats()
    await dao.createTableMessages()
  }

  /**
   * Adds message with given data to the database
   * Returns promise of the messageId
   * @param {Message} data
   * @returns {Promise<*>}
   */
  addMessageToDatabase = async (data) => {
    if (data.id)
      return dao.addNewMessage(data)
    else {
      const message = { ...data, id: this.createNewMessageId() }
      return dao.addNewMessage(message)
    }
  }

  /**
   * Adds chat with given data to the database
   * Returns promise of the chatId
   * @param {Chat} data
   * @returns {Promise<*>}
   */
  addChatToDatabase = async (data) => {
    if (data.id)
      return dao.addNewChat(data)
    else {
      const chat = { ...data, id: this.createNewChatId() }
      return dao.addNewChat(chat)
    }
  }

  /**
   * Returns all messages in message database
   * @returns {Promise<*>}
   */
  getAllMessages = async () => {
    return dao.getAllMessages()
  }

  /**
   * Returns all chats in chat database
   * @returns {Promise<*>}
   */
  getAllChats = async () => {
    return dao.getAllChats()
  }


  /**
   * Searches message database with given chatId
   * Returns promise of the list of messages
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchMessageDatabase = async (chatId) => {
    return dao.getMessages(chatId)
  }

  /**
   * Searches chat database with given chatId
   * Returns promise of the chat information
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchChatDatabase = async (chatId) => {
    return dao.getChat(chatId)
  }

  /**
   * Closes connection to local sqlite3 database
   */
  closeDataBaseConnection = () => {
    querier.closeDatabaseConnection()
  }

  createNewChatId() {
    return 102   // dao.getLastChatId() + 1
  }

  createNewMessageId() {
    return 286   // dao.getLastMessageId() + 1
  }

  readTestData = async () => {
    for (let c of testData.chats)
      this.addChatToDatabase(c)
    for (let m of testData.messages)
      this.addMessageToDatabase(m)
    logger.info(await this.getAllChats())
    logger.info(await this.getAllMessages())
  }
}

module.exports = DatabaseService