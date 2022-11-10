const logger    = require('../utils/logger')
const nodeState = require('../state/node')

const {
  WebSocket
}            = require('ws')

const connections = {}

const connect = (port) => {
  if(Object.hasOwn(connections, port)) {
    logger.error('Connection already in map:', port)
    return
  }

  logger.info('Connecting to:', port)
  const ws = new WebSocket(`ws://localhost:${port}`)

  ws.on('open', () => {
    ws.send(`Hello from ${nodeState.getListenPort()}`)
  })

  ws.on('message', (data, isBinary) => {
    const message = isBinary ? data : `${nodeState.getListenPort()} received ${data.toString()}`
    logger.info(message)
    //logger.info(`${nodeState.getListenPort()} received ${message}`)
  })

  connections[port] = ws
}

const disconnect = (port) => {
  if(!Object.hasOwn(connections, port)) {
    logger.error('Connection not found in map:', port)
    return
  }

  logger.info('Closing connection to:'. port)
  connections[port].close()
  delete connections[port]
}

const connectToAll = (ports) => {
  logger.info('Client connectToAll')
  ports.forEach(p => {
    connect(p)
  })
  logger.info('Client done connecting to all')
}

const getConnections = () => Object.keys(connections)

const disconnectFromAll = () => {
  logger.info('Client terminating all connections')
  Object.keys(connections).forEach(conn => {
    logger.info(`Terminating ${conn}`)
    disconnect(conn)
  })
  logger.info('Client done terminating all connections')
}

module.exports = {
  connect,
  disconnect,
  connectToAll,
  disconnectFromAll,
  getConnections
}
