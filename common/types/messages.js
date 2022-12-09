/**
 * Module that holds constructor function for different message types (work-in-progress)
 */


/**
 * Node-server requests syncing of messages
 * @param {*} payload
 * @returns
 */
const SyncRequest = (payload) => {
  return {
    name: 'syncRequest',
    payload // {} Object wtth several node_ids as keys which maps to every nodes message that has the largest id
  }
}

/**
 * Node-server replies with a payload that contains all the never messages
 * @param {*} payload
 * @returns
 */
const SyncReply = (payload) => {
  return {
    name: 'syncReply',
    payload // {} Object with node_ids that maps to arrays containing the full messages that has larger ids than the max node_id in syncRequest
  }
}

/**
 * Client sends this when connecting to server node
 * @returns
 */
const ClientSync = () => {
  return {
    name: 'clientSyncRequest',
    payload: [] // EMPTY arr
  }
}

/**
 * Server-node replies to client sync request with a list of messages
 * @returns
 */
const ClientSyncReply = (messagesArr) => {
  return {
    name: 'clientSyncReply',
    payload: messagesArr // [] Array containing all the newest messages with a maxlength to be defined
  }
}

/**
 * A new message from the client (user typed message)
 * @returns
 */
const ClientMessage = (messageObj) => {
  return {
    name: 'newMessageFromClient',
    payload: messageObj // {} Object of some sort to be defined
  }
}

/**
 * A list with all the new messages for the client (node-server receices message(s) from other node-servers)
 * @param {*} payload
 * @returns
 */
const MessagesToClient = (messagesArr) => {
  return {
    name: 'newMessagesForClient',
    payload: messagesArr // Array containing all the new messages that the client does not have
  }
}

/**
 * Server pushes to other server-nodes when it receives a new clientMessage (name: newMessageFromClient)
 * @returns
 */
const ShoutBroadcast = (messageObj) => {
  return {
    name: 'broadcastNewMessage',
    payload: messageObj // One single message
  }
}
