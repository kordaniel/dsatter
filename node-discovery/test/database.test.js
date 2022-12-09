/* eslint-disable no-undef */
/* eslint-disable no-console */

//const querier = require('../database/querier.js')
//const Dao = require('../database/dao.js')
const dbService = require('../database/database-service.js')
const testData = require('./test-data.js')

//jest.mock('../database/querier.js')
//jest.mock('../database/dao.js')

let dao

beforeAll(async () => {
  //dao = new Dao(querier)
  await dbService.initiateDatabase(':memory:')
  await dbService.openDatabaseConnection(dao)

  const td = testData.nodes
    .map(n => { return { password: n.password } })

  for (let n of td) {
    await dbService.addNodeToDatabase(n)
  }

  for (let a of testData.activeNodes) {
    await dbService.addActiveNodeToDatabase(a)
  }

  console.log(await dbService.getAllNodes())
  console.log(await dbService.getAllActiveNodes())
})

describe('Database service works correctly', () => {

  test('Searching nodes works correctly', async () => {
    const nodes = await dbService.getAllNodes()
    expect(nodes).toHaveLength(testData.nodes.length)

    //expect(nodes[2].id).toBe(56)
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