const logger    = require('../../../common/utils/logger')
const config    = require('../utils/config')
const nodeState = require('../state/node')
const { getRandomElementFromArr }    = require('../../../common/utils/helpers.js')

const { WebSocket } = require('ws')

const connections = {}

const parseSocket = (socket) => {
  const re = new RegExp('^(.+):([0-9]+)$')
  const match = socket.match(re)
  return { addr: match[1], port: match[2] }
}

// If address contains colon, assume IPv6
const isIPv6 = (addr) => {
  return addr.indexOf(':') > -1
}

const heartbeat = (ws) => {
  clearTimeout(ws.pingTimeout)

  ws.pingTimeout = setTimeout(() => {
    // TODO: Update otheractive nodes, report to discovery service
    ws.terminate()
  }, config.WS_PING_INTERVAL + config.MAX_EXPECTED_LATENCY)
}

const getRemoteAddress = (ws) => ws._url
const getConnections = () => Object.keys(connections)

const connect = (socket, sync) => {
  if(Object.hasOwn(connections, socket)) {
    logger.error('Connection already in map:', socket)
    return
  }

  const { addr, port } = parseSocket(socket)

  const endpointUrl = isIPv6(addr) ? `ws://[${addr}]:${port}` : `ws://${addr}:${port}`

  logger.info('Initializing WS connection to:', endpointUrl)

  const ws = new WebSocket(endpointUrl)

  // TODO: - State/info about running nodes should come directly from discovery service
  //         instead of updating it manually inside each node
  //       - When updating "anything", use the url/ip in the ws object(?)

  ws.on('error', (err) => {
    logger.info('WS client ERROR event:', err)
    nodeState.removeFromOtherActiveNodes(socket)
  })

  ws.on('open', () => {
    connections[socket] = ws
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
    } else if (typeof data === 'object' && data.name === 'syncReply') {
      sync.updateMessages(messageDiff)
    } else {
      logger.info(`RECEIVED message from ${getRemoteAddress(ws)} -> [[${message}]]`)
    }
  })

  ws.on('close', () => {
    // This event is fired even if there is an error before succesfull connection
    if (!Object.hasOwn(connections, socket)) {
      return
    }

    clearTimeout(ws.pingTimeout)
    const endpoint = getRemoteAddress(connections[socket])
    delete connections[socket]
    nodeState.removeFromOtherActiveNodes(socket)
    logger.info('CLOSED outbound WS connection to:', endpoint)
  })
}

const disconnect = (port) => {
  if(!Object.hasOwn(connections, port)) {
    logger.error('Connection not found in map:', port)
    return
  }

  logger.info('CLOSING outbound WS connection to:', getRemoteAddress(connections[socket]))
  connections[socket].close()
}

const connectToAll = (sockets) => sockets.forEach(s => connect(s))

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

const sendToAny = (message) => {
  getRandomElementFromArr(getConnections).send(message)
}

module.exports = {
  connect,
  disconnect,
  connectToAll,
  disconnectFromAll,
  openConnections,
  sendToAny,
  broadcastToAll
}
