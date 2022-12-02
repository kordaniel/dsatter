const WsServer = require('../sockets/ws-serv')

const wsNodeServer   = WsServer()
const wsClientServer = WsServer()
const wsClient       = require('../sockets/ws-client')


/**
 * Initializes all websocket servers to listen for WS connections on the
 * ports passed as argument and attempts to open a websocket client connection
 * to all servers specified in the array passed as the argument remoteEnpoints.
 * @param {Number} listenWsServerPort The port to listen for incoming WS connections from other node-servers.
 * @param {Number} listenWsClientPort The port to listen for incoming websocket connections from clients.
 * @param {Object[]} remoteEndpoints Array containing all remote endpoints.
 */
const initialize = (listenWsServerPort, listenWsClientPort, synchronizer, remoteEndpoints = []) => {
  wsClientServer.init(listenWsClientPort) // Serves as endpoint for clients to connect to
  wsNodeServer.init(listenWsServerPort, synchronizer)   // Serves as endpoint for other node-server instances to connect to
  wsClient.connectToAll(remoteEndpoints, synchronizer)  // Forms WS connection to all other running node-server instances
}

/**
 * Closes all open websocket connections and shuts down the websocket servers.
 */
const terminate = () => {
  wsClientServer.terminate()
  wsClient.disconnectFromAll()
  wsNodeServer.terminate()
}

const openInboundConnections  = () => wsNodeServer.openConnections()
const openOutboundConnections = () => wsClient.openConnections()
const openClientConnections   = () => wsClientServer.openConnections()

const openConnections = () => [
  ...openInboundConnections(),
  ...openOutboundConnections(),
  ...openClientConnections()
]

//const sendMessageToOne = () => {}

const broadcastToNodeServers = (message) => {
  wsNodeServer.broadcastToAll(message)
  wsClient.broadcastToAll(message)
}

const broadcastToClients = (message) => {
  wsClientServer.broadcastToAll(message)
}

module.exports = {
  initialize,
  terminate,
  openInboundConnections,
  openOutboundConnections,
  openClientConnections,
  openConnections,
  broadcastToNodeServers,
  broadcastToClients
}
