const wsServer = require('../sockets/ws-serv')
const wsClient = require('../sockets/ws-client')

/**
 * Initializes the websocket server to listen for WS connections on the
 * port passed as argument and attempts to open a websocket client connection
 * to all servers specified in the array passed as the argument remoteEnpoints.
 * @param {Number} listenPort The port to listen for incoming websocket connections.
 * @param {Number[]} remoteEndpoints Array containing all remote endpoints.
 */
const initialize = (listenPort, remoteEndpoints = []) => {
  // TODO: Get adress&port from config module
  wsServer.init(listenPort)
  wsClient.connectToAll(remoteEndpoints)
}

/**
 * Closes all open websocket connections and shuts down the websocket server.
 */
const terminate = () => {
  wsClient.disconnectFromAll()
  wsServer.terminate()
}

const openInboundConnections = ()  => wsServer.openConnections()
const openOutboundConnections = () => wsClient.openConnections()

const openConnections = () => [
  ...openInboundConnections(),
  ...openOutboundConnections()
]

//const sendMessageToOne = () => {}

const broadcastMessageToAll = (message) => {
  wsServer.broadcastToAll(message)
  wsClient.broadcastToAll(message)
}

module.exports = {
  initialize,
  terminate,
  openInboundConnections,
  openOutboundConnections,
  openConnections,
  broadcastMessageToAll
}
