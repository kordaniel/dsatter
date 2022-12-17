/**
 * Makes querys to dsatter database Chat tables
 *
 * @typedef {import(../../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../../common/types/datatypes).Node} Node
 */
class ChatDao {

  /**
   * Constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.db = querier
  }


  /**
   * Creates table OwnChats if that does not exist.
   * @returns {Promise}
   */
  createTableOwnChats() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS ownChats (
      node_id INTEGER NOT NULL,
      id INTEGER PRIMARY KEY,
      chatName TEXT NOT NULL)`)
  }

  /**
   * Creates table OutsideChats if that does not exist.
   * @returns {Promise}
   */
  createTableOutsideChats() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS ownChats (
      node_id INTEGER NOT NULL,
      id INTEGER NOT NULL,
      chatName TEXT NOT NULL,
      PRIMARY KEY (node_id, id))`)
  }

  /**
   * Returns all chats
   * @returns {Promise}
   */
  getAllChats() {
    return this.db.executeQuery('all', `SELECT chatName AS 'name',
    chatId AS 'chatId' FROM ownChats, outsideChats`)
  }

  /**
   * Returns chat with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getChat(chatId) {
    return this.db.executeQuery('get', `SELECT chatName AS 'name'
      FROM ownChats, outsideChats WHERE chatId = :chatId`, [chatId])
  }

  /**
   * Adds a own chat to table OwnChats
   * @param {Chat} chat
   * @returns {Promise}
   */
  addOwnChat(chat) {
    return this.db.executeQuery('get', `INSERT INTO chats
      (node_id, chatId, chatName) VALUES (?, ?, ?)
      RETURNING node_id || ' ' || id AS 'chatId'`,
    [chat.nodeId, chat.chatId, chat.name])
  }

  /**
   * Adds new outside chat to table OutsideChats
   * @param {Chat} chat
   * @returns {Promise}
   */
  addOutsideChat(chat) {
    return this.db.executeQuery('get', `INSERT INTO OutsideChats
      (node_id, id, chatId, chatName) VALUES (?, ?, ?, ?) 
      RETURNING  node_id || ' ' || id AS 'chatId'`,
    [chat.nodeId, chat.id, chat.chatId, chat.name])
  }

  /**
   * Returns the biggest existing chatId for given node
   * @returns {Promise}
   */
  getLastChatId(nodeId) {
    return this.db.executeQuery('get', `SELECT MAX(id) AS 'id'
      FROM ownChats, outsideChats WHERE node_id = :nodeId`, [nodeId])
  }

}

module.exports = ChatDao
