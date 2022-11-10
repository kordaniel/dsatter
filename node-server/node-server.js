
// TODO: Terminate connections properly from both ends and update connection "lists" at exit

// const config = require('./utils/config')
const logger = require('./utils/logger')

const nodeState = require('./state/node')
const wsServer  = require('./sockets/ws-serv')
const wsClient  = require('./sockets/ws-client')

// readline only for now for testing the connection
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

logger.info('CHATSERVER node starting')
logger.info('------------------------')

const init = async () => {
  try {
    await nodeState.initialize()
    wsServer.init(nodeState.getListenPort())
    wsClient.connectToAll(nodeState.getOtherActiveNodes())

    logger.info('Node initialized')
    logger.info('----------------')
    logger.info(`Listening for WS connection on PORT ${nodeState.getListenPort()}`)
    logger.info(`Other nodes online: ${nodeState.getOtherActiveNodes()}`)
    logger.info(`Outbound connections: ${wsClient.getConnections()}`)
    logger.info(`Inbound connections:  ${wsServer.getConnections()}`)
    logger.info('----------------')
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const terminate = async () => {
  wsClient.disconnectFromAll()
  wsServer.terminate()
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

const run = () => {
  rl.question('input: ', async (input) => {
    switch (input) {
      case 'quit':
        rl.close()
        await terminate()
        break
      case 'broadcast':
        // TODO: Send message to all connected nodes
        break
      case 'peers':
        logger.info('Peers:')
        logger.info(`\tOutbound: ${wsClient.getConnections()}`)
        logger.info(`\tInbound:  ${JSON.stringify(wsServer.getConnections())}`)
        run()
        break
      case 'nodes':
        // The ones that were running when this node instance registered
        logger.info('nodes online:', nodeState.getOtherActiveNodes())
        // falls through
      default:
        run()
        break
    }
  })
}

const initialize = async () => {
  await init()
  run()
}

initialize()
