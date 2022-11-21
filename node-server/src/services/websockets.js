const wsServer = require('../sockets/ws-serv')
const wsClient = require('../sockets/ws-client')

class WebsocketService {

  /**
   * Initializes the websocket server to listen for WS connections on the
   * port passed as argument and attempts to open a websocket client connection
   * to all servers specified in the array passed as the argument remoteEnpoints.
   * @param {Number} listenPort The port to listen for incoming websocket connections.
   * @param {Number[]} remoteEndpoints Array containing all remote endpoints.
   */
  initialize = (listenPort, remoteEndpoints = []) => {
    // TODO: Get adress&port from config module
    wsServer.init(listenPort)
    wsClient.connectToAll(remoteEndpoints)
  }

  /**
   * Closes all open websocket connections and shuts down the websocket server.
   */
  terminate = () => {
    wsClient.disconnectFromAll()
    wsServer.terminate()
  }

  openInboundConnections = ()  => {
    return wsServer.openConnections()
  }

  openOutboundConnections = () => {
    return wsClient.openConnections()
  }

  openConnections = () => {
    return [
      ...this.openInboundConnections(),
      ...this.openOutboundConnections()
    ]
  }

  //const sendMessageToOne = () => {}

  broadcastMessageToAll = (message) => {
    wsServer.broadcastToAll(message)
    wsClient.broadcastToAll(message)
  }
}

module.exports = WebsocketService
