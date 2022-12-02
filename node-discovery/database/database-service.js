const logger    = require('../../common/utils/logger')
const testData = require('../utils/test-data')
const querier = require('./querier')
const Dao = require('./dao')
let dao

/**
 * @typedef {import('../../../common/utils/types/datatypes).Node} Node
 * @typedef {import('../../../common/utils/types/datatypes).ActiveNode} ActiveNode
 */
class DatabaseService {

  /**
   * Initiates database
   */
  initiateDatabase = async () => {
    querier.initiateDatabase()
  }

  /**
   * Opens connection and initiates tables
   * @param {Dao} d
   */
  openDatabaseConnection = async (d = new Dao(querier)) => {
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
  addNodeToDatabase = async (data) => {
    if (data.id)
      return
    else {
      const node = { ...data, id: this.createNewNodeId() }
      return dao.addNewNode(node)
    }
  }

  /**
   * Adds a new active node to the database
   * @param {ActiveNode} data
   * @returns {Promise<*>}
   */
   addActiveNodeToDatabase = async (data) => {
    if (!data.id)
      return
    else {
      return dao.addNewActiveNode(data)
    }
  }

  /**
   * Returns all nodes in node database
   * @returns {Promise<*>}
   */
  getAllNodes = async () => {
    return dao.getAllNodes()
  }

  /**
   * Returns all active nodes in node database
   * @returns {Promise<*>}
   */
   getAllActiveNodes = async () => {
    return dao.getAllActiveNodes()
  }

  /**
   * Gets node with given id if exists
   * @param {number} id
   * @returns {Promise<*>}
   */
  searchNodeDatabase = async (id) => {
    return dao.getNode(id)
  }

  /**
   * Gets active node with given id if exists and is active
   * @param {number} id
   * @returns {Promise<*>}
   */
  searchActiveNodeDatabase = async (id) => {
    return dao.getActiveNode(id)
  }

  /**
   * Closes connection to local sqlite3 database
   */
  closeDataBaseConnection = () => {
    querier.closeDatabaseConnection()
  }

  createNodeId() {
    return dao.getLastChatId() + 1
  }

  readTestData = async () => {
    for (let n of testData.nodes)
      this.addNodeToDatabase(c)
    for (let a of testData.activeNodes)
      this.addMessageToDatabase(m)
    logger.info(await this.getAllNodes())
    logger.info(await this.getAllActiveNodes())
  }
}

module.exports = DatabaseService
