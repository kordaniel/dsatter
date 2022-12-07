/**
 * Makes querys to dsatter discovery database
 *
 * @typedef {import('../../common/utils/types/datatypes).Node} Node
 * @typedef {import('../../common/utils/types/datatypes).ActiveNode} ActiveNode
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
   * Creates table Nodes if that does not exist.
   * @returns {Promise}
   */
  createTableNodes() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS nodes (
      id INTEGER PRIMARY KEY NOT NULL,
      password TEXT)`)
  }

  /**
   * Creates table ActiveNodes if that does not exist.
   * @returns {Promise}
   */
  createTableActiveNodes() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS activeNodes (
      id INTEGER PRIMARY KEY NOT NULL,
      syncport INTEGER NOT NULL,
      clientport INTEGER NOT NULL,
      address TEXT NOT NULL)`)
  }

  /**
   * Returns all nodes
   * @returns {Promise}
   */
  getAllNodes() {
    return this.db.executeQuery('all', 'SELECT id AS \'id\', password AS \'password\' FROM nodes')
  }

  /**
   * Returns all activeNodes
   * @returns {Promise}
   */
  getAllActiveNodes() {
    return this.db.executeQuery('all', `SELECT id AS 'id',
      syncport  AS 'syncport',
      clientport AS 'clientport',
      address AS 'address' FROM activeNodes`)
  }

  /**
   * Returns node with given id
   * @param {number} id
   * @returns {Promise}
   */
  getNode(id) {
    return this.db.executeQuery('get', 'SELECT * FROM nodes WHERE id = :id', [id])
  }

  /**
   * Returns active node with given id
   * @param {number} id
   * @returns {Promise}
   */
  getActiveNode(id) {
    return this.db.executeQuery('get', `SELECT id AS 'id',
      syncport  AS 'syncport ',
      clientport AS 'clientport',
      address AS 'address' FROM activeNodes WHERE id = :id`, [id])
  }

  /**
   * Adds new node to table nodes
   * @param {Node} node
   * @returns {Promise}
   */
  addNewNode(node) {
    return this.db.executeQuery('run', `INSERT INTO nodes
      (id, password) VALUES (?, ?)`,
    [node.id, node.password])
  }

  /**
   * Adds new activeNode to table activeNodes
   * @param {ActiveNode} node
   * @returns {Promise}
   */
  addNewActiveNode(node) {
    return this.db.executeQuery('run', `INSERT INTO activeNodes
      (id, syncport, clientport, address) VALUES (?, ?, ?, ?)`,
    [node.id, node.syncport, node.clientport, node.address])
  }

  /**
   * Removes node by id from table activeNodes
   * @param {Number} id
   * @returns {Promise}
   */
  removeActiveNode(id) {
    return this.db.executeQuery(
      'run',
      'DELETE FROM activeNodes WHERE id = :id', [id]
    )
  }

  /**
   * Returns the biggest existing nodeId
   * @returns {Promise}
   */
  getLastNodeId() {
    return this.db.executeQuery('get', 'SELECT MAX(id) maxId FROM nodes')
  }
}

module.exports = Dao
