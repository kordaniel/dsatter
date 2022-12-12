/* eslint-disable no-undef */

const dbService = require('../database/database-service.js')
const testData = require('./test-data.js')

beforeAll(async () => {
  await dbService.initiateDatabase(':memory:')
  await dbService.openDatabaseConnection()

  const td = testData.nodes
    .map(n => { return { password: n.password } })

  for (let n of td) {
    await dbService.addNodeToDatabase(n)
  }

  for (let a of testData.activeNodes) {
    await dbService.addActiveNodeToDatabase(a)
  }
})

describe('Database service works correctly', () => {

  test('Searching nodes works correctly', async () => {
    const nodes = await dbService.getAllNodes()
    expect(nodes).toHaveLength(testData.nodes.length)
  })

  test('Searching active nodes works correctly', async () => {
    const activeNodes = await dbService.getAllActiveNodes()

    expect(activeNodes).toHaveLength(testData.activeNodes.length)

    for (let activeNode of testData.activeNodes) {
      expect(activeNodes).toContainEqual(activeNode)
    }
  })

  test('Removing active node by ID works correctly', async () => {
    const activeNodes = await dbService.getAllActiveNodes()
    const activeNode = activeNodes[0]
    expect(activeNodes).toHaveLength(testData.activeNodes.length)

    await dbService.removeActiveNodeFromDatabase(activeNode.id)
    const activeNodesLeft = await dbService.getAllActiveNodes()

    expect(activeNodesLeft).toHaveLength(testData.activeNodes.length - 1)
    expect(activeNodesLeft).not.toContainEqual(activeNode)
  })
})