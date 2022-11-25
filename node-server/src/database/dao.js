/**
 * Makes querys to dsatter database
 * 
 * @typedef {import('../../../common/utils/types/datatypes).Message} Message
 * @typedef {import('../../../common/utils/types/datatypes).Chat} Chat
 */
class Dao {

  /**
     * Constructor
     * @param {*} database
     */
  constructor(database) {
    this.db = database
  }

  /**
     * Executes database queries
     * @param {string} methodName
     * @param {string} query
     * @param {string[]} params
     * @returns {Promise}
     */
  executeQuery = async (methodName, query, params = []) => {
    return new Promise((resolve, reject) => {
      this.db[methodName](query, params, function(err, data) {
        console.log(data)
        if (err) {
          console.log('Error running sql: ' + query)
          console.log(err)
          reject(err)
        } else
          resolve(data)
      })
    })
  }

  /**
   * Creates table Messages if that does not exist.
   * @returns {Promise}
   */
  createTableMessages() {
    return this.executeQuery('run', `CREATE TABLE IF NOT EXISTS messages (
      node_id INTEGER,
      id INTEGER,
      chat_id INTEGER REFERENCES chats,
      messageText TEXT,
      messageDateTime TEXT,
      messageSender TEXT,
      PRIMARY KEY (node_id, id))`)
  }

  /**
   * Creates table Messages if that does not exist.
   * @returns {Promise}
   */
  createTableChats() {
    return this.executeQuery('run', `CREATE TABLE IF NOT EXISTS chats (
      node_id INTEGER,
      id INTEGER,
      chat_id INTEGER PRIMARY KEY,
      chatName TEXT)`)
  }

  /**
   * Returns chat with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getChat(chatId) {
    return this.executeQuery('get', `SELECT chatName AS 'name'
      FROM chats WHERE chat_id = :chatId`, [chatId])
  }

  /**
   * Returns messages with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getMessages(chatId) {
    return this.executeQuery('get', `SELECT messageText AS 'text',
      messageDateTime AS 'time',
      messageSender AS 'sender'
      FROM messages WHERE chat_id = :chatId`, [chatId])
  }

  /**
     * Adds new chat to table chats
     * @param {Chat} chat
     * @returns {Promise}
     */
  addNewChat(chat) {
    return this.executeQuery('run', `INSERT INTO chats
      (node_id, id, chat_id, chatName) VALUES (?, ?, ?, ?)`,
      [chat.nodeId, chat.id, chat.chatId, chat.chatName])
  }

  /**
     * Adds new message to table messages
     * @param {Message} message
     * @returns {Promise}
     */
  addNewMessage(message) {
    return this.executeQuery('run', `INSERT INTO messages
            (node_id, id, messageText, messageDateTime, messageSender, chat_id) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [message.nodeId, message.id, message.text, message.time, message.sender, message.chat_id])
  }
}

module.exports = Dao