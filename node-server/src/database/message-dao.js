/**
 * Makes querys to dsatter database Message tables
 *
 * @typedef {import(../../../common/types/datatypes).Message} Message
 * @typedef {import(../../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../../common/types/datatypes).Node} Node
 */
class MessageDao {

  /**
   * Constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.db = querier
  }

  /**
   * Creates table OwnMessages if that does not exist.
   * @returns {Promise}
   */
  createTableOwnMessages() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS ownMessages (
      node_id INTEGER NOT NULL,
      id INTEGER PRIMARY KEY,
      chat_id INTEGER,
      messageText TEXT NOT NULL,
      messageDateTime TEXT NOT NULL,
      messageSender TEXT NOT NULL)`)
  }

  /**
   * Creates table OutsideMessages if that does not exist.
   * @returns {Promise}
   */
  createTableOutsideMessages() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS outsideMessages (
      node_id INTEGER NOT NULL,
      id INTEGER NOT NULL,
      chat_id INTEGER,
      messageText TEXT NOT NULL,
      messageDateTime TEXT NOT NULL,
      messageSender TEXT NOT NULL,
      PRIMARY KEY (node_id, id))`)
  }


  /**
   * Returns all messages
   * @returns {Promise}
   */
  getAllMessages() {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      id AS 'id',
      node_id || id AS 'messageId',
      chat_id AS 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      UNION ALL
      SELECT node_id AS 'nodeId',
      id AS 'id',
      node_id || id AS 'messageId',
      chat_id AS 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM outsideMessages`)
  }

  /**
   * Returns message with given id
   * @param {number} messageId
   * @returns {Promise}
   */
  getMessage(messageId) {
    return this.db.executeQuery('get', `SELECT node_id AS 'nodeId',
      id as 'id',
      node_id || id AS 'messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      UNION
      SELECT node_id AS 'nodeId',
      id AS 'id',
      node_id || id AS 'messageId',
      chat_id AS 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM outsideMessages
      WHERE messageId = :messageId`, [messageId])
  }

  /**
   * Returns messages with given chatID
   * @param {number} chatId
   * @returns {Promise}
   */
  getMessages(chatId) {
    return this.db.executeQuery('all', `SELECT messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      UNION
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM outsideMessages
      WHERE chat_id = :chatId`, [chatId])
  }

  /**
   * Returns messages with given nodeId
   * @param {Number} nodeId
   * @returns {Promise}
   */
  getMessagesWithNodeId(nodeId) {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      id as 'id',  
      node_id || id AS messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      UNION
      SELECT node_id AS 'nodeId',
      id as 'id',  
      node_id || id AS messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM outsideMessages
      WHERE node_id = :nodeId`, [nodeId])
  }

  /**
   * Adds new client message to table ownMessages
   * @param {Message} message
   * @returns {Promise}
   */
  addOwnMessage(message) {
    return this.db.executeQuery('get',
      `INSERT INTO ownMessages
      (node_id, messageText, messageDateTime, messageSender, chat_id)
      VALUES (?, ?, ?, ?, ?) 
      RETURNING (node_id || id) AS messageId`,
      [message.nodeId, message.text, message.dateTime, message.sender, message.chatId])
  }

  /**
   * Adds new message from other node to table outsideMessages
   * @param {Message} message
   * @returns {Promise}
   */
  addOutsideMessage(message) {
    return this.db.executeQuery('get', `INSERT OR IGNORE
      INTO outsideMessages
      (node_id, id, messageText, messageDateTime, messageSender, chat_id)
      VALUES (?, ?, ?, ?, ?, ?) 
      RETURNING (node_id || id) AS messageId`,
    [message.nodeId, message.id, message.text, message.dateTime, message.sender, message.chatId])
  }

  /**
   * Returns the biggest existing messageId for given node
   * @param {number} nodeId
   * @returns {Promise}
   */
  getLastMessageId(nodeId) {
    return this.db.executeQuery('get',`SELECT MAX(id) AS 'maxId'
      FROM ownMessages
      UNION
      SELECT MAX(id) AS 'maxId'
      FROM outsideMessages 
      WHERE node_id = :nodeId`, [nodeId])
  }

  getLastMessageIds() {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      MAX(id) AS 'id'
      FROM outsideMessages
      GROUP BY node_id`)
  }

  /**
   * Returns all own messages with bigger id than the given id
   * @param {number} id
   * @returns {Promise}
   */
  getOwnMessagesAfter(id) {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      id as 'id',  
      node_id || id AS messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      WHERE (id > :id)`, [id])
  }

  /**
   * Returns all outside messages with given nodeId that have bigger id
   * than the given id
   * @param {number} nodeId
   * @param {number} id
   * @returns {Promise}
   */
  getMessagesAfter(nodeId, id) {
    return this.db.executeQuery('all', `SELECT node_id AS 'nodeId',
      id as 'id',  
      node_id || id AS messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM ownMessages
      UNION
      SELECT node_id AS 'nodeId',
      id as 'id',  
      node_id || id AS messageId,
      chat_id as 'chatId',
      messageText AS 'text',
      messageDateTime AS 'dateTime',
      messageSender AS 'sender'
      FROM outsideMessages
      WHERE (node_id = :nodeId) AND (id > :id)`, [nodeId, id])
  }

  getNodeIds() {
    return this.db.executeQuery('all',
      `SELECT DISTINCT node_id AS 'nodeId'
      FROM outsideMessages
      UNION
      SELECT id AS 'nodeId'
      FROM node`)
  }
}

module.exports = MessageDao
