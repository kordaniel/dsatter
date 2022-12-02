const querier = require('../database/querier.js')
const Dao = require('../database/dao.js')
const DatabaseService = require('../database/database-service.js')
const dbService = new DatabaseService()

jest.mock('../database/querier.js')
jest.mock('../database/dao.js')

let dao

beforeAll(() => {
  dao = new Dao(querier)
  dbService.openDatabaseConnection(dao)
})

describe('Database service works correctly', () => {

  test('Searching nodes works correctly', async () => {
    const nodes = await dbService.getAllNodes()
    expect(nodes[2].id).toBe(56)
  })

  test('Searching active nodes works correctly', async () => {
    const activeNodes = await dbService.getAllActiveNodes()
    expect(activeNodes[0].clientport).toBe(12001)
    expect(activeNodes[1].address).toBe('address2')
  })
})