const assert = require('assert')
const logger = require('../../../common/utils/logger')
const config = require('../utils/config')

const { WebSocketServer } = require('ws')

let wss = null
let interval = null

const heartbeat = (ws) => {
  ws.isAlive = true
}

const getRemoteAddress = (req) => `${req.socket.remoteAddress}:${req.socket.remotePort}`

/**
 * Opens websocket and handles all its traffic
 * @param {number} port
 */
const init = (port) => {
  assert(wss === null, 'ws-serv init(): wss is not null')

  wss = new WebSocketServer({ port })
  interval = setInterval(() => {
    wss.clients.forEach(ws => {
      if (ws.isAlive === false) {
        // TODO: Update otheractive nodes, report to discovery service
        return ws.terminate()
      }

      ws.isAlive = false
      ws.ping()
    })
  }, config.WS_PING_INTERVAL)

  wss.on('connection', (ws, req) => {
    logger.info(`OPENED inbound WS connection to: ${getRemoteAddress(req)}`)

    ws.on('error', (err) => {
      logger.info(`WS server ERROR event on WS connection to ${getRemoteAddress(req)}`, err)
    })

    ws.isAlive = true
    ws.on('pong', () => {
      heartbeat(ws)
    })

    ws.on('message', (data, isBinary) => {
      const message = isBinary ? data : data.toString()
      if (isBinary) {
        logger.info(`RECEIVED message from ${getRemoteAddress(req)} -> [[BINARY data not printed]]`)
      } else {
        logger.info(`RECEIVED message from ${getRemoteAddress(req)} -> [[${message}]]`)

      }
    })

    ws.on('close', () => {
      logger.info(`CLOSED inbound connection to ${getRemoteAddress(req)}`)
    })
  })

  wss.on('close', () => {
    clearInterval(interval)
    logger.info('WebSocket server closed')
    wss = null
  })
}

/**
 * Closes this websocket and terminates all connections to clients
 */
const terminate = () => {
  if (wss === null) {
    return
  }
  wss.clients.forEach(ws => {
    ws.close()
  })
  wss.close()
}

const openConnections = () => {
  // TODO: Read ws API docs to get rid of this hack
  return wss === null
    ? []
    : [ ...wss.clients ].map(ws => `${ws._socket.remoteAddress}:${ws._socket.remotePort}`)
}

const broadcastToAll = (message) => {
  wss.clients.forEach(client => {
    //if (client.readyState === WebSocket.OPEN) {}
    client.send(message)
  })
}


module.exports = {
  init,
  terminate,
  openConnections,
  broadcastToAll
}