
// TODO: update connection "lists" at exit

const config    = require('./utils/config')
const logger    = require('../common/utils/logger')
const nodeState = require('./state/node')
const {
  parseArgs
}               = require('../common/utils/helpers')

const websocketService = require('./services/websockets')

// readline only for now for testing the connection
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

logger.info('CHATSERVER node starting')
switch (process.env.NODE_ENV) {
  case 'development':
    logger.info('Running in development environment (localhost)')
    break
  case 'production':
    logger.info('Running in production mode')
    break
  default:
    logger.info('Running in unknown environment')
    break
}
logger.info('------------------------')

const init = async () => {
  const parsedArgs = parseArgs(process.argv, ['nodeservport'])

  if (process.env.NODE_ENV === 'production' &&
      !Object.hasOwn(parsedArgs, 'nodeservport')) {
    logger.error('Missing required argument --nodeservport=<port> when running in production mode. Exiting..')
    process.exit(64) // sysexits.h EX_USAGE (command line usage error)
  }

  const nodeServerPort = Object.hasOwn(parsedArgs, 'nodeservport')
    ? parsedArgs['nodeservport']
    : config.NODE_DEFAULT_SERV_WS_PORT

  try {
    await nodeState.initialize(
      nodeServerPort,
      config.NODE_DEFAULT_CLIENT_WS_PORT
    )

    websocketService.initialize(
      nodeState.getListenPortWsServers(),
      nodeState.getListenPortWsClients(),
      nodeState.getOtherActiveNodes()
    )

    logger.info('Node initialized')
    logger.info('----------------')
    logger.info(`Listening for WS connections from other node-servers on PORT ${nodeState.getListenPortWsServers()}`)
    logger.info(`Listening for WS connections from clients on PORT ${nodeState.getListenPortWsClients()}`)
    logger.info('Other nodes online:', nodeState.getOtherActiveNodes())
    logger.info('----------------')
  } catch (err) {
    logger.error('initializing:', err)
    process.exit(70) // sysexits.h EX_SOFTWARE (internal software error)
  }
}

const terminate = async () => {
  websocketService.terminate()
  try {
    await nodeState.close()
    logger.info()
    logger.info('------------------')
    logger.info('CHATSERVER node is terminating')
    logger.info('Other nodes online:', nodeState.getOtherActiveNodes())
  } catch (err) {
    logger.error('terminating:', err)
  }
}

/**
 * Runs only in development environment, outside containers
 */
const run = () => {
  rl.question('input: ', async (input) => {
    switch (input) {
      case 'quit':
        rl.close()
        await terminate()
        break
      case 'broadcasts':
        websocketService.broadcastToNodeServers(
          `MESSAGE to all nodes: I'm listening on port: ${nodeState.getListenPortWsServers()}`
        )
        run()
        break
      case 'broadcastc':
        websocketService.broadcastToClients(
          `MESSAGE to all clients: I'm listening on port: ${nodeState.getListenPortWsClients()}`
        )
        run()
        break
      case 'status':
        logger.info('Listening sockets:')
        logger.info(`\tNode servers: ${nodeState.getListenPortWsServers()}`)
        logger.info(`\tClients: ${nodeState.getListenPortWsClients()}`)
        logger.info('Open connections:')
        logger.info('\tOutbound:', websocketService.openOutboundConnections())
        logger.info('\tInbound:', websocketService.openInboundConnections())
        logger.info('\tClients:', websocketService.openClientConnections())
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
  if (process.env.NODE_ENV === 'development') {
    run()
  }
}

initialize()
