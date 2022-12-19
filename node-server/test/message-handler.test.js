/* eslint-disable no-undef */
/* eslint-disable no-console */

const nodeState = require('../src/state/node')
const querier = require('../src/database/querier')
const NodeDao = require('../src/database/node-dao')
const MessageDao = require('../src/database/message-dao')
const ChatDao = require('../src/database/chat-dao')
const Synchronizer = require('../src/services/synchronizer')
const messageTypes = require('../../common/types/messages')
const msgHandler = require('../src/services/message-handler')
const dbService = require('../src/services/database')
const helpers = require('../../common/utils/helpers')

jest.mock('../src/database/querier.js')
jest.mock('../src/database/message-dao.js')
jest.mock('../src/database/node-dao.js')
jest.mock('../src/database/chat-dao.js')
jest.mock('../src/state/node.js')


const clientMessage = messageTypes.ClientMessage(31337, {
  text: 'Test message',
  sender: 'Test user',
  chatId: 11
})

const clientMessageProcessed = {
  ...clientMessage.payload,
  nodeId: nodeState.getNodeId(),
  // These fields are not tested more than that they are defined (manually):
  // messageId: undefined, // node_id + id
  // dateTime: undefined   // message-handler sets time when handling msg
}

const generateSavedMessageObj = (nodeId, id, chatId = 11, sender = undefined) => {
  const messageId = helpers.concatenateIntegers(nodeId, id)

  return {
    id,
    nodeId,
    messageId,
    chatId,
    text: `This is a message with messageId: ${messageId}, broadcasted from an another node far far away.`,
    dateTime: new Date().toJSON(),
    sender: sender ? sender : `node ${nodeId} client`
  }
}

const address = 'ws://127.0.0.1:34567'
const synchronizer = new Synchronizer()
// NOTE: HACK.. Synchronizer needs arguments => If the tests crash,
//       this is probably the reason :>
// TODO: Mock or initialize synchronizer properly to be able to test
//       the message-handler completely


describe('Message handler', () => {
  let nodeDao = null
  let messageDao = null

  let broadcastedToClients = null
  let broadCastedToNodeServers = null

  let mockBroadCastToClients = null
  let mockBroadCastToNodeServers = null

  beforeEach(() => {
    nodeDao = new NodeDao(querier)
    messageDao = new MessageDao(querier)
    chatDao = new ChatDao(querier)
    dbService.openDatabaseConnection(nodeDao, messageDao, chatDao)

    broadcastedToClients = null
    broadCastedToNodeServers = null

    mockBroadCastToClients = jest.fn(message => {
      broadcastedToClients = message
    })
    mockBroadCastToNodeServers = jest.fn(message => {
      broadCastedToNodeServers = message
    })

    msgHandler.installCallbacks(
      synchronizer,
      mockBroadCastToClients,
      mockBroadCastToNodeServers
    )
  })

  afterEach(() => {
    dbService.closeDataBaseConnection()
  })

  test('Saves \'newMessageFromClient\' messages to DB', async () => {
    const initialMessages = await dbService.getAllMessages()

    const response = await msgHandler.handle(address, JSON.stringify(clientMessage))
    expect(response).not.toBeDefined()

    const allMessages = await dbService.getAllMessages()
    expect(allMessages).toHaveLength(initialMessages.length + 1)

    const savedMessage = allMessages.filter(m =>
      m.nodeId === clientMessageProcessed.nodeId &&
      m.text === clientMessageProcessed.text &&
      m.sender === clientMessageProcessed.sender &&
      m.chatId === clientMessageProcessed.chatId
    )

    expect(savedMessage).toHaveLength(1)
    expect(savedMessage[0]).toMatchObject(clientMessageProcessed)
  })

  test('Transmits processed \'newMessageFromClient\' messages to clients and other node-servers', async () => {
    await msgHandler.handle(address, JSON.stringify(clientMessage))

    expect(mockBroadCastToClients).toHaveBeenCalledTimes(1)
    expect(mockBroadCastToNodeServers).toHaveBeenCalledTimes(1)

    const serverMsgObj = broadCastedToNodeServers
    const clientMsgObj = broadcastedToClients

    expect(serverMsgObj.type).toBe('broadcastNewMessage')
    expect(serverMsgObj.payload).toBeDefined()

    expect(clientMsgObj.type).toBe('newMessagesForClient')
    expect(clientMsgObj.payload).toBeDefined()
    expect(clientMsgObj.payload).toHaveLength(1)

    const serverPayload = serverMsgObj.payload
    const clientPayload = clientMsgObj.payload[0]

    expect(serverPayload).toEqual(clientPayload)

    expect(serverPayload).toMatchObject(clientMessageProcessed)
    expect(serverPayload.nodeId).toBeDefined()
    expect(serverPayload.dateTime).toBeDefined()
  })

  test('Saves \'broadcastNewMessage\' messages to DB', async () => {
    const nodeId = nodeState.getNodeId() + 1

    const initialMessages = await dbService.getAllMessages()
    const msgObjId = await messageDao.generateMessageId(nodeId)

    const message = generateSavedMessageObj(nodeId, msgObjId)

    const response = await msgHandler.handle(address, JSON.stringify(messageTypes.ShoutBroadcast(nodeId, message)))
    expect(response).not.toBeDefined()

    const allMessages = await dbService.getAllMessages()

    expect(allMessages).toHaveLength(initialMessages.length + 1)
    expect(allMessages).toContainEqual(message)

  })

  test('Transmits processed \'broadcastNewMessage\' messages to clients (only)', async () => {
    const nodeId = nodeState.getNodeId() + 1

    const msgObjId = await messageDao.generateMessageId(nodeId)
    const message = generateSavedMessageObj(nodeId, msgObjId)

    await msgHandler.handle(address, JSON.stringify(messageTypes.ShoutBroadcast(nodeId, message)))

    expect(mockBroadCastToNodeServers).toHaveBeenCalledTimes(0)
    expect(mockBroadCastToClients).toHaveBeenCalledTimes(1)

    const clientMsgObj = broadcastedToClients

    expect(clientMsgObj.type).toBe('newMessagesForClient')
    expect(clientMsgObj.payload).toHaveLength(1)

    expect(clientMsgObj.payload[0]).toEqual(message)
  })

})
