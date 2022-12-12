/* eslint-disable no-undef */

const querier = require('../src/database/querier')
const Dao = require('../src/database/dao')
const dbService = require('../src/services/database')

jest.mock('../src/database/querier.js')
jest.mock('../src/database/dao.js')

let dao

beforeAll(() => {
  dao = new Dao(querier)
  dbService.openDatabaseConnection(dao)
})

describe('Database service works correctly', () => {

  test('Searching chats works correctly', async () => {
    const chat = await dbService.searchChatDatabase(11)
    expect(chat.name).toBe('important chat')
  })

  test('Searching messages works correctly', async () => {
    const message = await dbService.searchMessageDatabase(21)
    expect(message.chatId).toBe(11)
    expect(message.sender).toBe('Jaana')
  })

  test('Searching messages with chat works correctly', async () => {
    const messages = await dbService.searchMessagesWithChat(11)
    expect(messages[1].messageId).toBe(21)
    expect(messages[1].sender).toBe('Jaana')
  })
})