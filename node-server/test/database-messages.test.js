/* eslint-disable no-undef */

const dbService = require('../src/services/database')
const testData = require('../src/utils/test-data')

const messages = testData.messages

beforeAll(async () => {
  await dbService.initiateDatabase(':memory:')
  await dbService.openDatabaseConnection()
})

describe('Database service works correctly', () => {

  test('Table messages is empty at initialization', async () => {
    const dbMessages = await dbService.getAllMessages()
    expect(dbMessages).toHaveLength(0)
  })

  test('Message can be inserted', async () => {
    await dbService.addMessageToDatabase(messages[0])
    const dbMessages = await dbService.getAllMessages()
    expect(dbMessages).toHaveLength(1)
  })

  test('Several messages can be inserted', async () => {
    await dbService.addMessageToDatabase(messages[0])
    await dbService.addMessageToDatabase(messages[1])
    const dbMessages = await dbService.getAllMessages()

    expect(dbMessages).toHaveLength(2)
  })

  test('Message can be fetched by node_id', async () => {
    await dbService.addMessageToDatabase(messages[0])
    await dbService.addMessageToDatabase(messages[1])
    const messageWithNodeId = await dbService.getMessagesWithNodeId(messages[0].nodeId)
    expect(messageWithNodeId).toHaveLength(2)
  })
})
