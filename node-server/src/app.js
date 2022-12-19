const db = require('./services/database')
const config    = require('./utils/config')
const logger    = require('../../common/utils/logger')
const nodeState = require('./state/node')
const Synchronizer = require('./services/synchronizer')
const websocketService = require('./services/websockets')
const discoveryService = require('./services/discovery')

const {
  MessagesToClient
} = require('../../common/types/messages')

const {
  generateRandomString, getRandomElementFromArr, randomInt
} = require('../../common/utils/helpers')

let synchronizer = null // TODO: Refactor away..
let pushRandMsgTimer = null

const handleRegistration = async () => {
  const nodeServerObj = await db.getNode()

  if (nodeServerObj !== null) {
    return nodeServerObj
  }

  const newNodeServObj = await discoveryService.registerNode(generateRandomString(12))
  const result = await db.addNodeToDatabase(newNodeServObj)

  if (result === null) {
    process.exit(70) // internal software error
  }

  const savedNodeServerObj = await db.getNode()

  return savedNodeServerObj
}

const initialize = async (parsedArgs) => {
  const nodeServerPort = Object.hasOwn(parsedArgs, 'nodeservport')
    ? parsedArgs['nodeservport']
    : config.NODE_DEFAULT_SERV_WS_PORT
  const dbpath = Object.hasOwn(parsedArgs, 'dbpath')
    ? parsedArgs['dbpath']
    : config.DB_PATH
  await db.initiateDatabase(dbpath)
  await db.openDatabaseConnection()
  const nodeServObj = await handleRegistration()
  synchronizer = new Synchronizer(20000, db, websocketService)


  try {
    await nodeState.initialize(
      nodeServerPort,
      config.NODE_DEFAULT_CLIENT_WS_PORT,
      nodeServObj
    )
    websocketService.initialize(
      nodeState.getListenPortWsServers(),
      nodeState.getListenPortWsClients(),
      synchronizer,
      nodeState.getOtherActiveNodes()
    )

    logger.info('Node initialized')
    logger.info('----------------')
    logger.info(`Listening for WS connections from other node-servers on PORT ${nodeState.getListenPortWsServers()}`)
    logger.info(`Listening for WS connections from clients on PORT ${nodeState.getListenPortWsClients()}`)
    logger.info('Other nodes online:', nodeState.getOtherActiveNodes())
    logger.info('----------------')
    synchronizer.start()

    //pushTestMessage()
    //pushRandMsgTimer = setInterval(pushTestMessage, randomInt(6000, 9000))
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const pushTestMessage = async () => {
  const { randomInt, getRandomElementFromArr } = require('../../common/utils/helpers.js')
  const nodeId = nodeState.getNodeId()

  if (!nodeId) {
    logger.error('NODEID undefined')
    return
  }

  const message = {
    nodeId: nodeId,
    text: `this is a message that contains number ${randomInt(50, 839)}. The end.`,
    dateTime: new Date().toJSON(),
    sender: getRandomElementFromArr(['Julia', 'Jaana', 'Daniel', 'Joosua']),
    chatId: 11
  }
  logger.debug('Adding new test message...')
  await db.addMessageToDatabase(message)
}

const pushToClient = async () => {
  const msgArr = await db.getAllMessages()

  const msg = MessagesToClient(getRandomElementFromArr(msgArr))
  broadcastToClients(msg)
}

const broadcastToNodeServers = (message) => {
  websocketService.broadcastToNodeServers(message)
}

const broadcastToClients = (message) => {
  websocketService.broadcastToClients(message)
}

const openOutboundConnections = () => {
  return websocketService.openOutboundConnections()
}

const openInboundConnections = () => {
  return websocketService.openInboundConnections()
}

const openClientConnections = () => {
  return websocketService.openClientConnections()
}

const dumpDatabase = async () => {
  const messages = await db.getAllMessages()
  return messages
}

const terminate = async () => {
  const nodeServerObj = await db.getNode()

  if (nodeServerObj === null) {
    logger.error('Node credentials not found in DB')
    process.exit(70) // internal software error
  }

  if (pushRandMsgTimer) {
    clearInterval(pushRandMsgTimer)
    pushRandMsgTimer = null
  }

  synchronizer.stop()

  websocketService.terminate()
  try {
    await nodeState.close(nodeServerObj)
    logger.info()
    logger.info('------------------')
    logger.info('CHATSERVER node is terminating')
    logger.info('Other nodes running:', nodeState.getOtherActiveNodes())
  } catch (err) {
    logger.error('terminating:', err)
  }
}

module.exports = {
  pushToClient,
  pushTestMessage,
  initialize,
  broadcastToNodeServers,
  broadcastToClients,
  openOutboundConnections,
  openInboundConnections,
  openClientConnections,
  dumpDatabase,
  terminate
}
