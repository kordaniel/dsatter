const logger = require('../utils/logger')

const {
  WebSocketServer
}            = require('ws')

let wss = null

const init = (port) => {
  if (wss !== null) {
    throw Error('ws-serv init(): wss is not null')
  }

  wss = new WebSocketServer({ port })
  wss.on('connection', (ws, req) => {
    logger.info(`Connected to ${req.socket.remoteAddress}:${req.socket.remotePort}`)

    ws.on('message', (data, isBinary) => {
      const message = isBinary ? data : `-> ${req.socket.remoteAddress}:${req.socket.remotePort}: ${data.toString()}`
      logger.info(message)
      ws.send('ACK')
    })

    ws.on('close', () => {
      logger.info(`Disconnect from ${req.socket.remoteAddress}:${req.socket.remotePort}`)
    })
  })

  wss.on('close', () => {
    logger.info('WebSocket server closed')
    // set wss = null ??
  })
}

const terminate = () => {
  if (wss === null) {
    return
  }

  wss.clients.forEach(ws => {
    ws.close()
  })

  wss.close()
}

const getConnections = () => {
  // TODO: Read ws API docs to get rid of this hack
  return wss === null
    ? []
    : [ ...wss.clients ]
      .map(ws => `${ws._socket.remoteAddress}:${ws._socket.remotePort}`)
}


module.exports = {
  init,
  terminate,
  getConnections
}
