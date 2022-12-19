const testData = require('../../utils/test-data')
const logger = require('../../../../common/utils/logger')

class NodeDao {
  node

  // eslint-disable-next-line no-unused-vars
  constructor(querier) {
    logger.test('Mock database table Chats created')
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
