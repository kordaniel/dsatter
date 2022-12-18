/* eslint-disable no-undef */

const querier = require('../src/database/querier')
const NodeDao = require('../src/database/node-dao')
const MessageDao = require('../src/database/message-dao')
const ChatDao = require('../src/database/chat-dao')
const dbService = require('../src/services/database')

jest.mock('../src/database/querier.js')
jest.mock('../src/database/message-dao.js')
jest.mock('../src/database/node-dao.js')
jest.mock('../src/database/chat-dao.js')

let nodeDao
let messageDao

beforeAll(() => {
  nodeDao = new NodeDao(querier)
  messageDao = new MessageDao(querier)
  chatDao = new ChatDao(querier)
  dbService.openDatabaseConnection(nodeDao, messageDao, chatDao)
})

describe('Database service works correctly', () => {

  test('Searching chats works correctly', async () => {
    const chat = await dbService.searchChatDatabase(11)
    expect(chat.name).toBe('important chat')
  })

  test('Searching messages works correctly', async () => {
    const message = await dbService.searchMessageDatabase(10021)
    expect(message.chatId).toBe(11)
    expect(message.sender).toBe('Jaana')
  })

  test('Searching messages with chat works correctly', async () => {
    const messages = await dbService.searchMessagesWithChat(11)
    expect(messages[1].id).toBe(1)
    expect(messages[1].nodeId).toBe(1002)
    expect(messages[1].messageId).toBe(10021)
    expect(messages[1].sender).toBe('Jaana')
  })
})