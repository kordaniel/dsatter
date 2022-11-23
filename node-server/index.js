
// TODO: update connection "lists" at exit

const logger    = require('../common/utils/logger')
const nodeState = require('./state/node')

const websocketService = require('./services/websockets')

// readline only for now for testing the connection
const readline = require('readline')
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
})

const getPortArg = () => {
  const args = process.argv
  const portIx = args.indexOf('--port') + 1
  if(portIx > 0) {
    return args[portIx]
  }

  return -1
}

logger.info('CHATSERVER node starting')
logger.info('------------------------')

const init = async () => {
  try {
    const portArg = getPortArg()
    await nodeState.initialize(portArg)
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
//temporarily comment this because it breaks something
/*
const run = () => {
  rl.question('input: ', async (input) => {
    switch (input) {
      case 'quit':
        rl.close()
        await terminate()
        break
      case 'broadcast':
        websocketService.broadcastMessageToAll(`MESSAGE to all nodes: I'm listening on port: ${nodeState.getListenPort()}`)
        run()
        break
      case 'peers':
        logger.info('Peers:')
        logger.info('\tOutbound:', websocketService.openOutboundConnections())
        logger.info('\tInbound:', websocketService.openInboundConnections())
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

*/

const initialize = async () => {
  await init()
  //run()
}

initialize()
