const logger    = require('../../common/utils/logger')
const nodeState = require('./state/node')
const WebsocketService = require('./services/websockets')
const DatabaseService = require('./services/database')
const Synchronizer = require('./services/synchronizer.js')
let websocketService
let db
let synchronizer

const getPortArg = () => {
  const args = process.argv
  const portIx = args.indexOf('--port') + 1
  if(portIx > 0) {
    return args[portIx]
  }

  return -1
}

const initialize = async () => {
  websocketService = new WebsocketService()
  db = new DatabaseService()
  await db.initiateDatabase()
  await db.openDatabaseConnection()
  synchronizer = new Synchronizer(20, db.getDao(), websocketService)

  try {
    const ownPort = getPortArg()
    await nodeState.initialize(ownPort)
    websocketService.initialize(
      nodeState.getListenPort(),
      nodeState.getOtherActiveNodes()
    )
    logger.info('Node initialized')
    logger.info('----------------')
    logger.info(`Listening for WS connection on PORT ${nodeState.getListenPort()}`)
    logger.info(`Other nodes online: ${nodeState.getOtherActiveNodes()}`)
    logger.info('----------------')
    synchronizer.start()
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const returnConnections = () => {
  return [
    websocketService.openInboundConnections(),
    websocketService.openOutboundConnections()
  ]
}

const broadcastMessageToAll = (message) => {
  return websocketService.broadcastMessageToAll(message)
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
    logger.info(`Other nodes running: ${nodeState.getOtherActiveNodes()}`)
  } catch (err) {
    logger.error('terminating:', err)
  }
}

module.exports = {
  initialize,
  run,
  returnConnections,
  broadcastMessageToAll,
  terminate
}
