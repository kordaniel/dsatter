const logger    = require('../common/utils/logger')
const nodeState = require('./src/state/node')
const app       = require('./src/app')
const {
  parseArgs
}               = require('../common/utils/helpers')


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


const parsedArgs = parseArgs(process.argv, [])

// Make sure we have all the right, required arguments in every environment.
switch (process.env.NODE_ENV) {
  case 'development':
    if (!Object.hasOwn(parsedArgs, 'dbpath')) {
      logger.error('Missing required argument --dbpath=<PATH.db> when running in development mode. Exiting..')
      process.exit(64) // sysexits.h EX_USAGE (command line usage error)
    }
    break
  case 'production':
    if (!Object.hasOwn(parsedArgs, 'nodeservport')) {
      logger.error('Missing required argument --nodeservport=<port> when running in production mode. Exiting..')
      process.exit(64) // sysexits.h EX_USAGE (command line usage error)
    }
    break
  default: break
}


app.initialize(parsedArgs).then(() => {
  if (process.env.NODE_ENV === 'development') {
    run()
  }
})

// readline only for now for testing the connection
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

/**
 * Runs only in development environment, outside containers
 */
const run = () => {
  rl.question('input: ', async (input) => {
    switch (input) {
      case 'quit':
        rl.close()
        await app.terminate()
        break
      case 'broadcasts':
        app.broadcastToNodeServers(
          `MESSAGE to all nodes: I'm listening on port: ${nodeState.getListenPortWsServers()}`
        )
        run()
        break
      case 'broadcastc':
        app.broadcastToClients(
          `MESSAGE to all clients: I'm listening on port: ${nodeState.getListenPortWsClients()}`
        )
        run()
        break
      case 'status':
        logger.info('Listening sockets:')
        logger.info(`\tNode servers: ${nodeState.getListenPortWsServers()}`)
        logger.info(`\tClients: ${nodeState.getListenPortWsClients()}`)
        logger.info('Open connections:')
        logger.info('\tOutbound:', app.openOutboundConnections())
        logger.info('\tInbound:', app.openInboundConnections())
        logger.info('\tClients:', app.openClientConnections())
        run()
        break
      case 'nodes':
        // The ones that were running when this node instance registered
        logger.info('nodes online:', nodeState.getOtherActiveNodes())
        run()
        break
      case 'register':
        testRegistration()
        run()
        break
      default:
        run()
        break
    }
  })
}

// -----------------------------------------------
// TODO: REMOVE!!!
const discoveryService = require('./src/services/discovery')
const testRegistration = async () => {
  const id = await discoveryService.registerNode()
  logger.info('Discovery node replied with:', id)
  return id
}
