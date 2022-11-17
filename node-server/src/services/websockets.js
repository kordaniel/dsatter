const wsServer = require('../sockets/ws-serv')
const wsClient = require('../sockets/ws-client')
const databaseService = require('./database')
let db

export default class WebsocketService {

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
    db = new databaseService()
  }

  /**
   * Makes database querys and returns promises
   * @param {*} message 
   * @returns {Promise<*>}
   */
  makeDatabaseQuery = async (message) => {
    switch (message.query) {
      case 'addMessage':
        return db.addMessageToDatabase(message.data)
      case 'addChat':
        return db.addChatToDatabase(message.data)
      case 'searchMessages':
        return db.searchMessageDatabase(message.data)
      case 'searchChats':
        return db.searchChatDatabase(message.data)
    }
  }

  /**
   * Closes all open websocket connections and shuts down the websocket server.
   */
  terminate = () => {
    wsClient.disconnectFromAll()
    wsServer.terminate()
  }

  openInboundConnections = ()  => wsServer.openConnections()
  openOutboundConnections = () => wsClient.openConnections()

  openConnections = () => [
    ...openInboundConnections(),
    ...openOutboundConnections()
  ]

  //const sendMessageToOne = () => {}

  broadcastMessageToAll = (message) => {
    wsServer.broadcastToAll(message)
    wsClient.broadcastToAll(message)
  }
}
