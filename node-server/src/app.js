const logger    = require('../../common/utils/logger')
const nodeState = require('./state/node')
const WebsocketService = require('./services/websockets')
const DatabaseService = require('./services/database')
let websocketService
let db

const init = async () => {
  websocketService = new WebsocketService()
  db = new DatabaseService()
  db.openDatabaseConnection()
  try {
    await nodeState.initialize()
    websocketService.initialize(
      nodeState.getListenPort(),
      nodeState.getOtherActiveNodes()
    )
    logger.info('Node initialized')
    logger.info('----------------')
    logger.info(`Listening for WS connection on PORT ${nodeState.getListenPort()}`)
    logger.info(`Other nodes online: ${nodeState.getOtherActiveNodes()}`)
    logger.info('----------------')
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const returnConnections = () => {
  return websocketService.openConnections()
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
makeDatabaseQuery = async (message) => {
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



const initialize = async () => {
  await init()
}

module.exports = {
    initialize,
    run,
    returnConnections,
    terminate
}