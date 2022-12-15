/**
 * Module that holds constructor function for different message types (work-in-progress)
 */

/**
 * Node-server requests syncing of messages
 * @param {number} id Sender's id
 * @param {*} payload
 * @returns {type: string, sender: number, payload: *}
 */
const SyncRequest = (id, payload) => {
  return {
    type: 'syncRequest',
    sender: id,
    payload // {} Object wtth several node_ids as keys which maps to every nodes message that has the largest id
  }
}

/**
 * Node-server replies with a payload that contains all the never messages
 * @param {number} id Sender's id
 * @param {*} payload
 * @returns {type: string, sender: number, payload: *}
 */
const SyncReply = (id, payload) => {
  return {
    type: 'syncReply',
    sender: id,
    payload // {} Object with node_ids that maps to arrays containing the full messages that has larger ids than the max node_id in syncRequest
  }
}

/**
 * Client sends this when connecting to server node
 * @param {number} id Sender's id
 * @returns {type: string, sender: number, payload: Array<*>}
 */
const ClientSync = (id) => {
  return {
    type: 'clientSyncRequest',
    sender: id,
    payload: [] // EMPTY arr
  }
}

/**
 * Server-node replies to client sync request with a list of messages
 * @param {number} id Sender's id
 * @param {*} messagesArr
 * @returns {type: string, sender: number, payload: Array<*>}
 */
const ClientSyncReply = (id, messagesArr) => {
  return {
    type: 'clientSyncReply',
    sender: id,
    payload: Array.isArray(messagesArr) // [] Array containing all the newest messages with a maxlength to be defined
      ? messagesArr
      : [messagesArr]
  }
}

/**
 * A new message from the client (user typed message)
 * @param {number} id Sender's id
 * @param {*} messageObj
 * @returns {type: string, sender: number, payload: *}
 */
const ClientMessage = (id, messageObj) => {
  return {
    type: 'newMessageFromClient',
    sender: id,
    payload: messageObj // {} Object of some sort to be defined
  }
}

/** THIS IS NOT NEEDED (?), USE MessgesToClient instead...
const ClientMessageResponse = (messagesArr) => {
  return {
    type: 'clientMessageResponse',
    payload: Array.isArray(messagesArr)
      ? messagesArr
      : [ messagesArr ]
  }
}
*/

/**
 * A list with all the new messages for the client (node-server receices message(s) from other node-servers)
 * @param {number} id Sender's id
 * @param {Array<*>} messagesArr
 * @returns {type: string, sender: number, payload: Array<*>}
 */
const MessagesToClient = (id, messagesArr) => {
  return {
    type: 'newMessagesForClient',
    sender: id,
    payload: Array.isArray(messagesArr) // Array containing all the new messages that the client does not have
      ? messagesArr
      : [messagesArr]
  }
}

/**
 * Server pushes to other server-nodes when it receives a new clientMessage   
type: newMessageFromClient)
 * @param {number} id Sender's id
 * @param {*} messageObj
 * @returns {type: string, sender: number, payload: *}
 */
const ShoutBroadcast = (id, messageObj) => {
  if (Array.isArray(messageObj)) {
    logger.error('ShoutBroadcast() got an Array as argument for payload to broadcastNewMessage')
    return undefined
  }

  return {
    type: 'broadcastNewMessage',
    sender: id,
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
