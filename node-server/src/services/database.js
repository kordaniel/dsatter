const sqlite3 = require('sqlite3').verbose()
const logger    = require('../../../common/utils/logger')
const Dao = require('../database/dao')
let databaseHandler
let db

/**
 * @typedef {import('../../../common/utils/types/datatypes).Message} Message
 * @typedef {import('../../../common/utils/types/datatypes).Chat} Chat
 */

class DatabaseService {

  /**
   * Opens connection to local sqlite3 database
   */
  openDatabaseConnection = async () => {
    db = new sqlite3.Database('./db/dsatter.db', (err) => {
      if (err) logger.error('Error in connecting to the database: ', err)
      else logger.info('Connected to dsatter database')
    })
    databaseHandler = new Dao(db)
    databaseHandler.createTableChats()
    databaseHandler.createTableMessages()
  }

  /**
   * Adds message with given data to the database
   * Returns promise of the messageId
   * @param {Message} data
   * @returns {Promise<*>}
   */
  addMessageToDatabase = async (data) => {
    if (data.id)
      return databaseHandler.addNewMessage(data)
    else {
      const message = {...data, id: createNewMessageId()}
      return databaseHandler.addNewMessage(message)
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
      return databaseHandler.addNewChat(data)
    else {
      const chat = {...data, id: createNewChatId()}
      return databaseHandler.addNewChat(chat)
    }
  }

  /**
   * Searches message database with given chatId
   * Returns promise of the list of messages
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchMessageDatabase = async (chatId) => {
    return databaseHandler.getMessages(chatId)
  }

  /**
   * Searches chat database with given chatId
   * Returns promise of the chat information
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchChatDatabase = async (chatId) => {
    return databaseHandler.getChat(chatId)
  }

  /**
   * Closes connection to local sqlite3 database
   */
  closeDataBaseConnection = () => {
    db.close((err) => {
      if (err) logger.error('Error in closing database connection: ', err)
      else logger.info('Database connection closed')
    })
  }

  createNewChatId() {
    return databaseHandler.getLastChatId() + 1
  }

  createNewMessageId() {
    return databaseHandler.getLastMessageId() + 1
  }
}

module.exports = DatabaseService