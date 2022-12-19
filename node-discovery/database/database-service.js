/**
* @typedef {import(../../common/utils/types/datatypes).RegisteredNode} Node
* @typedef {import(../../common/utils/types/datatypes).ActiveNode} ActiveNode
*/
const logger   = require('../../common/utils/logger')
const querier  = require('./querier')
const Dao      = require('./dao')

let dao = null

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
  await dao.createTableNodes()
  await dao.createTableActiveNodes()
}

/**
 * Adds a new node to the database
 * Returns automatically created nodeId
 * @param {Node} node
 * @returns {Node.id}
 */
const addNodeToDatabase = async (node) => {
  if (node.id)
    return
  else {
    const newNode = await dao.addNewNode(node)
    logger.debug('Adding node to DB:', newNode)
    return newNode
  }
}

/**
 * Adds a new active node to the database
 * @param {ActiveNode} data
 * @returns {Promise<*>}
 */
const addActiveNodeToDatabase = async (data) => {
  if (!data.id)
    return
  else {
    return dao.addNewActiveNode(data)
  }
}

/**
 * Removes a node from the active nodes table by id
 * @param {number} id
 * @returns {Promise}
 */
const removeActiveNodeFromDatabase = async (id) => {
  return dao.removeActiveNode(id)
}

/**
 * Returns all nodes in node database
 * @returns {Promise<*>}
 */
const getAllNodes = async () => {
  return dao.getAllNodes()
}

/**
 * Returns all active nodes in node database
 * @returns {Promise<*>}
 */
const getAllActiveNodes = async () => {
  return dao.getAllActiveNodes()
}

/**
 * Gets node with given id if exists
 * @param {number} id
 * @returns {Promise<*>}
 */
const searchNodeDatabase = async (id) => {
  return dao.getNode(id)
}

/**
 * Gets active node with given id if exists and is active
 * @param {number} id
 * @returns {Promise<*>}
 */
const searchActiveNodeDatabase = async (id) => {
  return dao.getActiveNode(id)
}

const clearActiveNodeDatabase = async () => {
  return dao.clearActiveNode()
}

/**
 * Closes connection to local sqlite3 database
 */
const closeDataBaseConnection = () => {
  querier.closeDatabaseConnection()
}

module.exports = {
  initiateDatabase,
  openDatabaseConnection,
  addNodeToDatabase,
  addActiveNodeToDatabase,
  removeActiveNodeFromDatabase,
  getAllNodes,
  getAllActiveNodes,
  searchNodeDatabase,
  searchActiveNodeDatabase,
  clearActiveNodeDatabase,
  closeDataBaseConnection
}
