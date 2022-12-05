const logger    = require('../../../common/utils/logger')
const testData = require('../../utils/test-data')

class Dao {
  nodes
  activeNodes

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    logger.info('Mock database created')
  }

  createTableNodes = () => {
    this.nodes = testData.nodes
  }

  createTableActiveNodes = () => {
    this.activeNodes = testData.activeNodes
  }

  getAllNodes = () => {
    return Promise.resolve(this.nodes)
  }

  getAllActiveNodes = () => {
    return Promise.resolve(this.activeNodes)
  }

  getNode = (id) => {
    return Promise.resolve(this.nodes.filter((n) => n.id === id))
  }

  getActiveNode = (id) => {
    return Promise.resolve(this.activeNodes.filter((n) => n.id === id))
  }

  addNewNode = (node) => {
    const newNodes = [...this.nodes, node]
    this.nodes = newNodes
    return Promise.resolve(this.nodes)
  }

  addNewActiveNode = (node) => {
    const newActiveNodes = [...this.activeNodes, node]
    this.activeNodes = newActiveNodes
    return Promise.resolve(this.activeNodes)
  }
}

module.exports = Dao