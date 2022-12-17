/**
 * @typedef {import(../../../common/types/datatypes).Message} Message
 * @typedef {import(../../../common/types/datatypes).Chat} Chat
 * @typedef {import(../../../common/types/datatypes).RegisteredNode} RegisteredNode
 */

const logger    = require('../../../common/utils/logger')
const querier = require('../database/querier')
const NodeDao = require('../database/node-dao')
const MessageDao = require('../database/message-dao')
const ChatDao = require('../database/chat-dao')

let nodeDao
let messageDao
let chatDao

/**
 * Initiates database
 */
const initiateDatabase = async (dbpath) => {
  querier.initiateDatabase(dbpath)
}

/**
 * Opens connection and initiates tables
 * @param {NodeDao} nodeD
 * @param {MessageDao} messageD
 * @param {ChatDao} chatD
 */
const openDatabaseConnection = async (
  nodeD = new NodeDao(querier),
  messageD = new MessageDao(querier),
  chatD = new ChatDao(querier)) => {
  nodeDao = nodeD
  messageDao = messageD
  chatDao = chatD
  await nodeDao.createTableNode()
  await messageDao.createTableOwnMessages()
  await messageDao.createTableOutsideMessages()
  await chatDao.createTableOwnChats()
  await chatDao.createTableOutsideChats()
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
  const existingNode = await nodeDao.getNode()
  if (existingNode) {
    await nodeDao.removeNodes()
  }
  return nodeDao.addNewNode(node)
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
    return messageDao.addOwnMessage(msgObj)
  }
  return messageDao.addOutsideMessage(msgObj)
}

/**
 * Adds chat with given data to the database
 * Returns promise of the chatId
 * @param {Chat} data
 * @returns {Promise<*>}
 */
const addChatToDatabase = async (data) => {
  if (!data.id)
    return chatDao.addOwnChat(data)
  return chatDao.addOutsideChat(data)
}

/**
 * Returns all nodes in the node database.
 * There should be only one node.
 * @returns {Promise<*>}
 */
const getNode = async () => {
  const allNodes = await nodeDao.getNode()
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
  return messageDao.getAllMessages()
}

/**
 * Returns all messages with given nodeId in message database
 * @param {number} nodeId
 * @returns {Promise<*>}
 */
const getMessagesWithNodeId = async (nodeId) => {
  return messageDao.getMessagesWithNodeId(nodeId)
}

/**
 * Returns all chats in chat database
 * @returns {Promise<*>}
 */
const getAllChats = async () => {
  return chatDao.getAllChats()
}

const getNodeIds = async () => {
  return await messageDao.getNodeIds()
}

const getLastMessageIds = async () => {
  return await messageDao.getLastMessageIds()
}

const getMessagesAfter = async (nodeId, id) => {
  // const ownId = await nodeDao.getNode().id
  // let messages
  // if (nodeId === ownId)
  //   messages = await messageDao.getOwnMessagesAfter(id)
  // const outsideM = await messageDao.getOutsideMessagesAfter(nodeId, id)
  // return messages.concat(outsideM)
  return messageDao.getMessagesAfter(nodeId, id)
}

/**
 * Searches message database with given chatId
 * Returns promise of the list of messages
 * @param {number} chatId
 * @returns {Promise<*>}
 */
const searchMessagesWithChat = async (chatId) => {
  return await messageDao.getMessages(chatId)
}

/**
 * Searches message database with given chatId
 * Returns promise of the list of messages
 * @param {number} messageId
 * @returns {Promise<*>}
 */
const searchMessageDatabase = async (messageId) => {
  return await messageDao.getMessage(messageId)
}

/**
 * Searches chat database with given chatId
 * Returns promise of the chat information
 * @param {number} chatId
 * @returns {Promise<*>}
 */
const searchChatDatabase = async (chatId) => {
  return await chatDao.getChat(chatId)
}

/**
 * Closes connection to local sqlite3 database
 */
const closeDataBaseConnection = () => {
  querier.closeDatabaseConnection()
}

const getNodeDao = () => nodeDao
const getMessageDao = () => messageDao
const getChatDao = () => chatDao


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
  getNodeDao,
  getMessageDao,
  getChatDao
}
