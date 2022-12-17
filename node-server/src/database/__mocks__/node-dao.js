/* eslint-disable no-console */

const testData = require('../../utils/test-data')

class NodeDao {
  chats
  messages

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    console.log('Mock database table Node created')
  }

  createTableNode = () => {
    this.nodes = testData.nodes
  }

  getNode = () => {
    //return Promise.resolve(this.nodes[0])
  }

  addNewNode = (node) => {

  }

}

module.exports = NodeDao
