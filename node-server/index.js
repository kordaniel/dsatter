
// TODO: update connection "lists" at exit

const logger    = require('../common/utils/logger')
const nodeState = require('./src/state/node')
const WebsocketService = require('./src/services/websockets')
let websocketService

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
  websocketService = new WebsocketService()
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
      case 'send':
        const message = {
          text: "moi",
          sender: "me",
          time: "10:30", 
          chat_id: 1
        }
        websocketService.broadcastMessageToAll(message)
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
