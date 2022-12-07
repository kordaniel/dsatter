const DatabaseService = require('./services/database')

const config    = require('./utils/config')
const logger    = require('../../common/utils/logger')

const nodeState = require('./state/node')
const Synchronizer = require('./services/synchronizer.js')
const websocketService = require('./services/websockets')

let db

const initialize = async (parsedArgs) => {
  const nodeServerPort = Object.hasOwn(parsedArgs, 'nodeservport')
    ? parsedArgs['nodeservport']
    : config.NODE_DEFAULT_SERV_WS_PORT
  const dbpath = Object.hasOwn(parsedArgs, 'dbpath')
    ? parsedArgs['dbpath']
    : config.DB_PATH

  db = new DatabaseService()
  await db.initiateDatabase(dbpath)
  await db.openDatabaseConnection()
  synchronizer = new Synchronizer(20000, db, websocketService)

  try {
    await nodeState.initialize(
      nodeServerPort,
      config.NODE_DEFAULT_CLIENT_WS_PORT
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
    pushRandomMessages()
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const pushRandomMessages = () => {
  pushTestMessage()
  const randomInt = require('../../common/utils/helpers.js').randomInt
  setTimeout(pushRandomMessages, randomInt(5000, 50000))
}

const pushTestMessage = () => {
  const randomInt = require('../../common/utils/helpers.js').randomInt
  const nodeId = parseInt(nodeState.getListenPortWsServers())
  const id = randomInt(100, 10000)
  const message = {
    nodeId: nodeId,
    id: id,
    messageId: `${nodeId}${id}`,
    text: `this is a message that contains number ${randomInt(50, 839)}. The end.`,
    dateTime: new Date().toLocaleString([], { hour12: false }),
    sender: 'Julia',
    chatId: 11
  }
  logger.info('Adding new test message...')
  db.addMessageToDatabase(message)
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



/**
 * Listen to Websocket messages and react
 */
const run = () => {

}

/**
 * Makes database querys and returns promises
 * @param {ClientMessage} message
 * @returns {Promise<*>}
 * @private
 */
const makeDatabaseQuery = async (message) => {
  switch (message.query) {
    case 'addMessage':
      return db.addMessageToDatabase(message.data)
    case 'addChat':
      return db.addChatToDatabase(message.data)
    case 'searchMessages':
      return db.searchMessageDatabase(message.data)
    case 'searchChats':
      return db.searchChatDatabase(message.data)
  }
}

const terminate = async () => {
  websocketService.terminate()
  try {
    await nodeState.close()
    logger.info()
    logger.info('------------------')
    logger.info('CHATSERVER node is terminating')
    logger.info('Other nodes running:', nodeState.getOtherActiveNodes())
  } catch (err) {
    logger.error('terminating:', err)
  }
}

module.exports = {
  initialize,
  run,
  broadcastToNodeServers,
  broadcastToClients,
  openOutboundConnections,
  openInboundConnections,
  openClientConnections,
  dumpDatabase,
  terminate
}
