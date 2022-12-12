/* eslint-disable no-undef */

const querier = require('../database/querier.js')
const Dao = require('../database/dao.js')
const dbService = require('../database/database-service.js')
const testData = require('./test-data.js')

jest.mock('../database/querier.js')
jest.mock('../database/dao.js')

let dao

beforeAll(async () => {
  dao = new Dao(querier)
  await dbService.openDatabaseConnection(dao)
})

describe('Database service works correctly', () => {

  test('Searching nodes works correctly', async () => {
    const nodes = await dbService.getAllNodes()
    expect(nodes[2].id).toBe(56)
  })

  test('Searching active nodes works correctly', async () => {
    const activeNodes = await dbService.getAllActiveNodes()
    expect(activeNodes).toHaveLength(testData.activeNodes.length)
  })
})