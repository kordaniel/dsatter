const querier = require('../../src/database/querier.js')
const Dao = require('../../src/database/dao.js')
const DatabaseService = require('../../src/services/database.js')
const dbService = new DatabaseService()

jest.mock('../../src/database/querier.js')
jest.mock('../../src/database/dao.js')

let dao

beforeAll(() => {
  dao = new Dao(querier)
  dbService.openDatabaseConnection(dao)
})

describe('Database service works correctly', () => {

  test('Searching chats works correctly', async () => {
    const chats = await dbService.searchChatDatabase(11)
    expect(chats[0].name).toBe('important chat')
  })

  test('Searching messages works correctly', async () => {
    const messages = await dbService.searchMessageDatabase(11)
    expect(messages[1].messageId).toBe(21)
    expect(messages[1].sender).toBe('Jaana')
  })
})