const logger    = require('../../../common/utils/logger')
const testData = require('../utils/test-data')
const querier = require('../database/querier')
const Dao = require('../database/dao')
let dao

/**
 * @typedef {import('../../../common/utils/types/datatypes).Message} Message
 * @typedef {import('../../../common/utils/types/datatypes).Chat} Chat
 * @typedef {import('../../../common/utils/types/datatypes).Node} Node
 */
class DatabaseService {

  /**
   * Initiates database
   */
  initiateDatabase = async (dbpath) => {
    querier.initiateDatabase(dbpath)
  }

  /**
   * Opens connection and initiates tables
   * @param {Dao} d
   */
  openDatabaseConnection = async (d = new Dao(querier)) => {
    dao = d
    await dao.createTableChats()
    await dao.createTableMessages()
    await dao.createTableNode()
  }

  /**
   * Adds chat with given data to the database
   * Returns promise of the chatId
   * @param {Chat} data
   * @returns {Promise<*>}
   */
  addNodeToDatabase = async (node) => {
    if (!node.id || !node.password) {
      logger.error('Attempted to add a node without id or passwd to DB')
      return null
    }

    // TODO: Handle case when id is already in the DB. (empty array always evaluates to true)

    return dao.addNewNode(node)
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
   * Returns all nodes in the node database.
   * There should be only one node.
   * @returns {Promise<*>}
   */
  getNode = async () => {
    const allNodes = await dao.getNode()

    if (allNodes.length > 1) {
      logger.error('Several node objects in DB')
    }

    return allNodes.length !== 0
      ? allNodes[0]
      : null
  }

  /**
   * Returns all messages in message database
   * @returns {Promise<*>}
   */
  getAllMessages = async () => {
    return dao.getAllMessages()
  }

  /**
   * Returns all messages with given nodeId in message database
   * @param {Number} nodeId
   * @returns {Promise<*>}
   */
  getMessagesWithNodeId = async (nodeId) => {
    return dao.getMessagesWithNodeId(nodeId)
  }

  /**
   * Returns all chats in chat database
   * @returns {Promise<*>}
   */
  getAllChats = async () => {
    return dao.getAllChats()
  }

  getNodeIds = async () => {
    return await dao.getNodeIds()
  }

  getLastMessageIds = async () => {
    return await dao.getLastMessageIds()
  }

  getMessagesAfter = async (nodeId, id) => {
    return await dao.getMessagesAfter(nodeId, id)
  }

  /**
   * Searches message database with given chatId
   * Returns promise of the list of messages
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchMessageDatabase = async (chatId) => {
    return await dao.getMessages(chatId)
  }

  /**
   * Searches chat database with given chatId
   * Returns promise of the chat information
   * @param {number} chatId
   * @returns {Promise<*>}
   */
  searchChatDatabase = async (chatId) => {
    return await dao.getChat(chatId)
  }

  /**
   * Closes connection to local sqlite3 database
   */
  closeDataBaseConnection = () => {
    querier.closeDatabaseConnection()
  }

  createNewChatId() {
    return dao.getLastChatId() + 1
  }

  createNewMessageId() {
    return dao.getLastMessageId() + 1
  }

  readTestData = async () => {
    for (let c of testData.chats)
      this.addChatToDatabase(c)
    for (let m of testData.messages)
      this.addMessageToDatabase(m)
    logger.info(await this.getAllChats())
    logger.info(await this.getAllMessages())
  }

  getDao = () => dao
}

module.exports = DatabaseService
