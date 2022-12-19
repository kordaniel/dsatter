/**
 * Module that holds constructor functions for different message types
 */

/**
 * Node-server requests syncing of messages
 * @param {number} id source's id
 * @param {*} payload
 * @returns {type: string, source: number, payload: *}
 */
const SyncRequest = (id, payload) => {
  return {
    type: 'syncRequest',
    source: id,
    payload // {} Object with several nodeIds as keys, which maps for every node the message that has the largest id
  }
}

/**
 * Node-server replies with a payload that contains all the never messages
 * @param {number} id source's id
 * @param {*} payload
 * @returns {type: string, source: number, payload: *}
 */
const SyncReply = (id, payload) => {
  return {
    type: 'syncReply',
    source: id,
    payload // {} Object with nodeIds, which maps to arrays containing the full messages that have larger ids than the max nodeId in syncRequest
  }
}

/**
 * Client sends this when connecting to server node
 * @param {number} id source's id
 * @returns {type: string, source: number, payload: Array<*>}
 */
const ClientSync = (id) => {
  return {
    type: 'clientSyncRequest',
    source: id,
    payload: [] // EMPTY arr
  }
}

/**
 * Server-node replies to client sync request with a list of messages
 * @param {number} id source's id
 * @param {*} messagesArr
 * @returns {type: string, source: number, payload: Array<*>}
 */
const ClientSyncReply = (id, messagesArr) => {
  return {
    type: 'clientSyncReply',
    source: id,
    payload: Array.isArray(messagesArr) // [] Array containing all the newest messages with a maxlength to be defined
      ? messagesArr
      : [messagesArr]
  }
}

/**
 * A new message from the client (user-typed message)
 * @param {number} id source's id
 * @param {*} messageObj
 * @returns {type: string, source: number, payload: *}
 */
const ClientMessage = (id, messageObj) => {
  return {
    type: 'newMessageFromClient',
    source: id,
    payload: messageObj // {} Object of some sort to be defined
  }
}

/**
 * A list with all the new messages for the client (node-server receices message(s) from other node-servers)
 * @param {number} id source's id
 * @param {Array<*>} messagesArr
 * @returns {type: string, source: number, payload: Array<*>}
 */
const MessagesToClient = (id, messagesArr) => {
  return {
    type: 'newMessagesForClient',
    source: id,
    payload: Array.isArray(messagesArr) // Array containing all the new messages that the client does not have
      ? messagesArr
      : [messagesArr]
  }
}

/**
 * Server pushes to other server-nodes when it receives a new clientMessage   
type: newMessageFromClient)
 * @param {number} id source's id
 * @param {*} messageObj
 * @returns {type: string, source: number, payload: *}
 */
const ShoutBroadcast = (id, messageObj) => {
  if (Array.isArray(messageObj)) {
    logger.error('ShoutBroadcast() got an Array as argument for payload to broadcastNewMessage')
    return undefined
  }

  return {
    type: 'broadcastNewMessage',
    source: id,
    payload: messageObj // One single message
  }
}

module.exports = {
  SyncRequest,
  SyncReply,
  ClientSync,
  ClientSyncReply,
  ClientMessage,
  MessagesToClient,
  ShoutBroadcast
}
