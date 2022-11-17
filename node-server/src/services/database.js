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
      if (err) console.log('Error in connecting to the database: ', err)
      else console.log('Connected to dsatter database')
    })
    databaseHandler = new Dao(db)
    databaseHandler.createTableChats()
    databaseHandler.createTabledatas()
  }

  addMessageToDatabase = async (data) => {
    const data = {
      text = data.text,
      time = data.time, 
      sender = data.sender, 
      chat_id = data.chatId
    }
    return databaseHandler.addNewMessage(data)
  }

  addChatToDatabase = async (data) => {
    const chat = data.chatName
    return databaseHandler.addNewChat(chat)
  }

  searchMessageDatabase = async (chatId) => {
    return databaseHandler.getMessages(chatId)
  }

  searchChatDatabase = async (chatId) => {
    return databaseHandler.getChat(chatId)
  }

  /**
   * Closes connection to local sqlite3 database
   */
  closeDataBaseConnection = () => {
    db.close((err) => {
      if (err) console.log('Error in closing database connection: ', err)
      else console.log('Database connection closed')
    })
  }

}