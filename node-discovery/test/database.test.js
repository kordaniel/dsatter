/* eslint-disable no-undef */
/* eslint-disable no-console */

const querier = require('../database/querier.js')
const Dao = require('../database/dao.js')
const dbService = require('../database/database-service.js')
const testData = require('./test-data.js')

jest.mock('../database/querier.js')
jest.mock('../database/dao.js')

let dao

beforeAll(async () => {
  dao = new Dao(querier)
  dbService.openDatabaseConnection(dao)

  for (let n of testData.nodes) {
    await dbService.addNodeToDatabase(n)
  }

  console.log(await dbService.getAllNodes())
  console.log(await dbService.getAllActiveNodes())
})

describe('Database service works correctly', () => {

  test('Searching nodes works correctly', async () => {
    const nodes = await dbService.getAllNodes()
    expect(nodes.length).toBe(testData.nodes.length)
    expect(nodes[2].id).toBe(56)
  })

  test('Searching active nodes works correctly', async () => {
    const activeNodes = await dbService.getAllActiveNodes()
    expect(activeNodes.length).toBe(testData.activeNodes.length)
    expect(activeNodes[0].clientport).toBe(12001)
    expect(activeNodes[1].address).toBe('address2')
  })
})