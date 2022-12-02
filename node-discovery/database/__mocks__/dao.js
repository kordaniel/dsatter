const logger    = require('../../../../common/utils/logger')
const testData = require('../../utils/test-data')

class Dao {
  nodes
  activeNodes
  
  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    logger.test('Mock database created')
  }

  createTableNodes = () => {
    this.nodes = testData.nodes
  }

  createActiveNodes = () => {
    this.activeNodes = testData.activeNodes
  }

  getNodes = () => {
    return Promise.resolve(this.nodes)
  }

  getActiveNodes = () => {
    return Promise.resolve(this.activeNodes)
  }

  getNodeById = (id) => {
    return Promise.resolve(this.nodes.filter((n) => n.id === id))
  }

  getActiveNodeById = (id) => {
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