const logger    = require('../../../common/utils/logger')
const config    = require('../utils/config')
const nodeState = require('../state/node')
const { parseSocket } = require('../../../common/utils/helpers')
const { WebSocket } = require('ws')

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

const connect = (socket, handle) => {
  const endpointUrl = `ws://${parseSocket(socket)}`

  if(Object.hasOwn(connections, endpointUrl)) {
    logger.error('Connection already in map:', endpointUrl)
    return
  }

  logger.info('Initializing outbound WS connection to:', endpointUrl)
  const ws = new WebSocket(endpointUrl)

  ws.on('error', (err) => {
    logger.info('WS client ERROR event:', err)
    nodeState.removeFromOtherActiveNodes(socket)
  })

  ws.on('open', () => {
    connections[endpointUrl] = ws
    heartbeat(ws)
    logger.info('OPENED outbound WS connection to:', endpointUrl)
    ws.send(`HELLO. I'm listening for node-server WS connections on port: ${nodeState.getListenPortWsServers()}`)
  })

  ws.on('ping', () => {
    heartbeat(ws)
  })

  ws.on('message', async (data, isBinary) => {
    const message = isBinary ? data : data.toString()
    if (isBinary) {
      logger.info(`RECEIVED message from ${getRemoteAddress(ws)} -> [[BINARY data not printed]]`)
    } else {
      const response = await handle(getRemoteAddress(ws), message)
      if (response)
        ws.send(response)
    }
  })

  ws.on('close', () => {
    // This event is fired even if there is an error before successful connection
    if (!Object.hasOwn(connections, endpointUrl)) {
      return
    }
    clearTimeout(ws.pingTimeout)
    const remoteEndpoint = getRemoteAddress(connections[endpointUrl])
    delete connections[endpointUrl]
    nodeState.removeFromOtherActiveNodes(socket)
    logger.info('CLOSED outbound WS connection to:', remoteEndpoint)
  })
}

const disconnect = (endpointUrl) => {
  if(!Object.hasOwn(connections, endpointUrl)) {
    logger.error('Connection not found in map:', endpointUrl)
    return
  }

  logger.info('CLOSING outbound WS connection to:', getRemoteAddress(connections[endpointUrl]))
  connections[endpointUrl].close()
}

const connectToAll = (sockets, synchronizer) => {
  sockets.forEach(s => connect(s, synchronizer))
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
