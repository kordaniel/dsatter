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
 * Returns promise of the nodeId
 * @param {Node} data
 * @returns {Promise<*>}
 */
const addNodeToDatabase = async (data) => {
  if (data.id)
    return
  else {
    // NOTE: Race condition might happen here..(?)
    // -------------------------------------------
    //       The database should probably assign a new id when
    //       adding the new node
    const node = { ...data, id: await createNewNodeId() }
    logger.debug('Adding node to DB:', node)
    await dao.addNewNode(node)
    return searchNodeDatabase(node.id)
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
 * @param {Number} id
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

const createNewNodeId = async () => {
  const { maxId } = await dao.getLastNodeId()
  return maxId === null ? 1 : maxId + 1
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
  closeDataBaseConnection,
  createNewNodeId
}
