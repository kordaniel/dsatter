const logger    = require('../common/utils/logger')
const nodeState = require('./src/state/node')
const app = require('./src/app')

app.initialize().then(() => {run()})

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
        logger.info('\tConnections:', app.returnConnections())
        run()
        break
      case 'nodes':
        // The ones that were running when this node instance registered
        logger.info('nodes online:', nodeState.getOtherActiveNodes())
        // falls through
      case 'send':
        websocketService.broadcastMessageToAll(message)
      default:
        run()
        break
    }
  })
}