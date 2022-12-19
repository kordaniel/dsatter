/**
 * Makes querys to dsatter database table Node
 *
 * @typedef {import(../../../common/types/datatypes).Node} Node
 */
class NodeDao {

  /**
   * Constructor
   * @param {Querier} querier
   */
  constructor(querier) {
    this.db = querier
  }


  /**
   * Creates table Node for own info if that does not exist.
   * @returns {Promise}
   */
  createTableNode() {
    return this.db.executeQuery('run', `CREATE TABLE IF NOT EXISTS node (
      id INTEGER PRIMARY KEY NOT NULL,
      password TEXT NOT NULL)`)
  }

  /**
   * Returns the node
   * @returns {Promise}
   */
  getNode() {
    return this.db.executeQuery('all', `SELECT id AS 'id',
      password AS 'password' FROM node`)
  }

  /**
   * Adds new node to table nodes
   * @param {Node} node
   * @returns {Promise}
   */
  addNewNode(node) {
    return this.db.executeQuery('run', `INSERT INTO node
      (id, password) VALUES (?, ?)`,
    [node.id, node.password])
  }

  /**
   * Removes nodes from table node
   * @returns {Promise}
   */
  removeNodes() {
    return this.db.executeQuery('run', 'DELETE FROM node')
  }
}

module.exports = NodeDao
