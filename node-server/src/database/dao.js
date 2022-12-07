/**
 * Makes querys to dsatter database
 *
 * @typedef {import('../../../common/utils/types/datatypes).Message} Message
 * @typedef {import('../../../common/utils/types/datatypes).Chat} Chat
 */
class Dao {

  /**
   * Constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.db = querier
  }


  /**
   * Creates table Messages if that does not exist.
   * @returns {Promise}
   */
  createTableMessages() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS messages (
      node_id INTEGER NOT NULL,
      id INTEGER NOT NULL,
      messageId INTEGER PRIMARY KEY NOT NULL,
      chat_id INTEGER NOT NULL,
      messageText TEXT,
      messageDateTime TEXT,
      messageSender TEXT)`)
  }

  /**
   * Creates table Messages if that does not exist.
   * @returns {Promise}
   */
  createTableChats() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS chats (
      node_id INTEGER NOT NULL,
      id INTEGER NOT NULL,
      chatId INTEGER PRIMARY KEY NOT NULL,
      chatName TEXT)`)
  }

  /**
   * Returns all chats
   * @returns {Promise}
   */
  getAllChats() {
    return this.db.executeQuery('all', `SELECT chatId AS 'chatId',
      chatName AS 'name' FROM chats`)
  }

  /**
   * Returns all messages
   * @returns {Promise}
   */
  getAllMessages() {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      id AS 'id',
      chat_id AS 'chatId',
      messageText AS 'text',
      messageDateTime AS 'time',
      messageSender AS 'sender' FROM messages`)
  }

  /**
   * Returns chat with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getChat(chatId) {
    return this.db.executeQuery('get', `SELECT chatName AS 'name'
      FROM chats WHERE chatId = :chatId`, [chatId])
  }

  /**
   * Returns messages with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getMessages(chatId) {
    return this.db.executeQuery('all', `SELECT messageText AS 'text',
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
    return this.db.executeQuery('run', `INSERT INTO chats
      (node_id, id, chatId, chatName) VALUES (?, ?, ?, ?)`,
    [chat.nodeId, chat.id, chat.chatId, chat.name])
  }

  /**
   * Adds new message to table messages
   * @param {Message} message
   * @returns {Promise}
   */
  addNewMessage(message) {
    return this.db.executeQuery('run', `INSERT OR IGNORE INTO messages
      (node_id, id, messageId, messageText, messageDateTime, messageSender, chat_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [message.nodeId, message.id, message.messageId, message.text, 
      message.dateTime, message.sender, message.chat_id])
  }

  /**
   * Returns the biggest existing chatId for given node
   * @returns {Promise}
   */
  getLastChatId(nodeId) {
    return this.db.executeQuery('get', `SELECT MAX(id)
      FROM chats WHERE node_id = :nodeId`, [nodeId])
  }

  /**
   * Returns the biggest existing messageId for given node
   * @returns {Promise}
   */
  getLastMessageId(nodeId) {
    return this.db.executeQuery('all', `SELECT MAX(id)
      FROM messages WHERE node_id = :nodeId`, [nodeId])
  }

  getLastMessageIds() {
    return this.db.executeQuery('all', `SELECT node_id, MAX(id) 
      FROM messages 
      WHERE node_id IS NOT NULL AND id IS NOT NULL 
      GROUP BY node_id`)
  }

  getMessagesAfter(nodeId, id) {
    return this.db.executeQuery('all', `SELECT * FROM messages 
      WHERE (node_id = ?) AND (id > ?)`, [nodeId, id])
  }

  getNodeIds() {
    return this.db.executeQuery('all', `SELECT DISTINCT node_id 
      FROM messages WHERE node_id IS NOT NULL`)
  }
}

module.exports = Dao
