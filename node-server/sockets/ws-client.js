const logger    = require('../utils/logger')
const config    = require('../utils/config')
const nodeState = require('../state/node')

const {
  WebSocket
}               = require('ws')

const connections = {}

const heartbeat = (ws) => {
  clearTimeout(ws.pingTimeout)

  ws.pingTimeout = setTimeout(() => {
    // TODO: Update otheractive nodes, report to discovery service
    ws.terminate()
  }, config.WS_PING_INTERVAL + config.MAX_EXPECTED_LATENCY)
}

const getRemoteAddress = (ws) => ws._url
const getConnections = () => Object.keys(connections)

const connect = (port) => {
  if(Object.hasOwn(connections, port)) {
    logger.error('Connection already in map:', port)
    return
  }

  const endpointUrl = `ws://localhost:${port}`

  logger.info('Initializing WS connection to:', endpointUrl)

  const ws = new WebSocket(endpointUrl)

  // TODO: - State/info about running nodes should come directly from discovery service
  //         instead of updating it manually inside each node
  //       - When updating "anything", use the url/ip in the ws object(?)

  ws.on('error', (err) => {
    logger.info('WS client ERROR event:', err)
    nodeState.removeFromOtherActiveNodes(port)
  })

  ws.on('open', () => {
    connections[port] = ws
    heartbeat(ws)
    logger.info('OPENED outbound WS connection to:', endpointUrl)
    ws.send(`HELLO. I'm listening for WS connections on port: ${nodeState.getListenPort()}`)
  })

  ws.on('ping', () => {
    heartbeat(ws)
  })

  ws.on('message', (data, isBinary) => {
    const message = isBinary ? data : data.toString()
    if (isBinary) {
      logger.info(`RECEIVED message from ${getRemoteAddress(ws)} -> [[BINARY data not printed]]`)
    } else {
      logger.info(`RECEIVED message from ${getRemoteAddress(ws)} -> [[${message}]]`)
    }
  })

  ws.on('close', () => {
    // This event is fired even if there is an error before succesfull connection
    if (!Object.hasOwn(connections, port)) {
      return
    }

    clearTimeout(ws.pingTimeout)
    const endpoint = getRemoteAddress(connections[port])
    delete connections[port]
    nodeState.removeFromOtherActiveNodes(port)
    logger.info('CLOSED outbound WS connection to:', endpoint)
  })
}

const disconnect = (port) => {
  if(!Object.hasOwn(connections, port)) {
    logger.error('Connection not found in map:', port)
    return
  }

  logger.info('CLOSING outbound WS connection to:', getRemoteAddress(connections[port]))
  connections[port].close()
}

const connectToAll = (ports) => {
  ports.forEach(p => {
    connect(p)
  })
}

const disconnectFromAll = () => {
  getConnections().forEach(conn => {
    disconnect(conn)
  })
}

const openConnections = () =>
  getConnections()
    .map(c => getRemoteAddress(connections[c]))

const broadcastToAll = (message) => {
  getConnections().forEach(conn => {
    //if (conn.readyState === WebSocket.OPEN) {}
    connections[conn].send(message)
  })
}

module.exports = {
  connect,
  disconnect,
  connectToAll,
  disconnectFromAll,
  openConnections,
  broadcastToAll
}
