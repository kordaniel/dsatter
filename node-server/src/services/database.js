const sqlite3 = require('sqlite3').verbose()
const Dao = require("../database/dao")
let databaseHandler 
let db

export default class DatabaseService {

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
   * @param {*} data 
   * @returns {Promise<*>}
   */
  addMessageToDatabase = async (data) => {
    const data = {
      text = data.text,
      time = data.time, 
      sender = data.sender, 
      chat_id = data.chatId
    }
    return databaseHandler.addNewMessage(data)
  }

  /**
   * Adds chat with given data to the database
   * Returns promise of the chatId
   * @param {*} data 
   * @returns {Promise<*>}
   */
  addChatToDatabase = async (data) => {
    const chat = data.chatName
    return databaseHandler.addNewChat(chat)
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

}