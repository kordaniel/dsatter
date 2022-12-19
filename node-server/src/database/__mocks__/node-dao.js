/* eslint-disable no-console */

const testData = require('../../utils/test-data')

class NodeDao {
  node

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    console.log('Mock database table Node created')
  }

  createTableNode = () => {
    this.node = [testData.nodes[0]]
  }

  getNode = () => {
    return Promise.resolve(this.node[0])
  }

  addNewNode = (node) => {
    this.nodes = [node]
  }

}

module.exports = NodeDao
