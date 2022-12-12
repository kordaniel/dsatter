/**
 * @typedef {import(../../../common/types/datatypes).Message} Message
 * @typedef {import(../../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../../common/types/datatypes).RegisteredNode} RegisteredNode
 */

const logger    = require('../../../common/utils/logger')
const querier = require('../database/querier')
const Dao = require('../database/dao')
const {
  concateIntegers
} = require('../../../common/utils/helpers')


let dao

/**
 * Initiates database
 */
const initiateDatabase = async (dbpath) => {
  querier.initiateDatabase(dbpath)
}

/**
 * Opens connection and initiates tables
 * @param {Dao} d
 */
const openDatabaseConnection = async (d = new Dao(querier)) => {
  dao = d
  await dao.createTableChats()
  await dao.createTableMessages()
  await dao.createTableNode()
}

/**
 * Adds node with given data to the database
 * Returns promise
 * @param {RegisteredNode} node
 * @returns {Promise<*>}
 */
const addNodeToDatabase = async (node) => {
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
const addMessageToDatabase = async (data) => {
  const msgObj = data

  if (!msgObj.nodeId) {
    logger.error('attempted to add a message without nodeId field')
    return null
  }

  if (!msgObj.id) {
    const id = await createNewMessageId(msgObj.nodeId)
    msgObj.id = id
    msgObj.messageId = concateIntegers(msgObj.nodeId, msgObj.id)
  } else if (!msgObj.messageId) {
    msgObj.messageId = concateIntegers(msgObj.nodeId, msgObj.id)
  }

  return dao.addNewMessage(msgObj)
}

/**
 * Adds chat with given data to the database
 * Returns promise of the chatId
 * @param {Chat} data
 * @returns {Promise<*>}
 */
const addChatToDatabase = async (data) => {
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
const getNode = async () => {
  const allNodes = await dao.getNode()
  if (allNodes.length > 1) {
    logger.error('Several node objects in DB')
  }
  return allNodes.length !== 0? allNodes[0] : null
}

/**
 * Returns all messages in message database
 * @returns {Promise<*>}
 */
const getAllMessages = async () => {
  return dao.getAllMessages()
}

/**
 * Returns all messages with given nodeId in message database
 * @param {number} nodeId
 * @returns {Promise<*>}
 */
const getMessagesWithNodeId = async (nodeId) => {
  return dao.getMessagesWithNodeId(nodeId)
}

/**
 * Returns all chats in chat database
 * @returns {Promise<*>}
 */
const getAllChats = async () => {
  return dao.getAllChats()
}

const getNodeIds = async () => {
  return await dao.getNodeIds()
}

const getLastMessageIds = async () => {
  return await dao.getLastMessageIds()
}

const getMessagesAfter = async (nodeId, id) => {
  return await dao.getMessagesAfter(nodeId, id)
}

/**
 * Searches message database with given chatId
 * Returns promise of the list of messages
 * @param {number} chatId
 * @returns {Promise<*>}
 */
const searchMessagesWithChat = async (chatId) => {
  return await dao.getMessages(chatId)
}

/**
 * Searches message database with given chatId
 * Returns promise of the list of messages
 * @param {number} messageId
 * @returns {Promise<*>}
 */
const searchMessageDatabase = async (messageId) => {
  return await dao.getMessage(messageId)
}

/**
 * Searches chat database with given chatId
 * Returns promise of the chat information
 * @param {number} chatId
 * @returns {Promise<*>}
 */
const searchChatDatabase = async (chatId) => {
  return await dao.getChat(chatId)
}

/**
 * Closes connection to local sqlite3 database
 */
const closeDataBaseConnection = () => {
  querier.closeDatabaseConnection()
}

const createNewChatId = () => {
  return dao.getLastChatId() + 1
}

const createNewMessageId = async (nodeId) => {
  const { maxId } = await dao.getLastMessageId(nodeId)
  return maxId === null ? 1 : maxId + 1
}

const getDao = () => dao


module.exports = {
  initiateDatabase,
  openDatabaseConnection,
  addNodeToDatabase,
  addChatToDatabase,
  addMessageToDatabase,
  getNode,
  getAllMessages,
  getMessagesWithNodeId,
  getAllChats,
  getNodeIds,
  getLastMessageIds,
  getMessagesAfter,
  searchMessagesWithChat,
  searchMessageDatabase,
  searchChatDatabase,
  closeDataBaseConnection,
  createNewChatId,
  createNewMessageId,
  getDao
}
