/**
 * Handles synchronization messages recieved from clients and other servers
 * @typedef {import(../../../common/types/datatypes).SyncMessage} SyncMessage
 */

const logger = require('../../../common/utils/logger')
const db = require('./database')
const messageTypes = require('../../../common/types/messages')
const {
  getNodeId
} = require('../state/node')

let synchronizer = null
let broadCastToClients = null
let broadCastToNodeServers = null

const installCallbacks = (
  synchronizerObj,
  broadCastToClientsCallback,
  broadCastToNodeServersCallback
) => {
  synchronizer = synchronizerObj
  broadCastToClients = broadCastToClientsCallback
  broadCastToNodeServers = broadCastToNodeServersCallback
}


const handleNewClientMessage = async (nodeId, message) => {
  if (!nodeId) {
    logger.error('handling message from client, nodeId is undefined')
    return null
  }

  const msg = {
    //id DATABASE creates id, message_id
    nodeId,
    ...message, //text, sender, chatId
    dateTime: new Date().toJSON()
  }

  const added = await addMessageToDatabase(msg)

  if (added) {
    const clientMsg = messageTypes.MessagesToClient(nodeId, added)
    const serverMsg = messageTypes.ShoutBroadcast(nodeId, added)
    broadCastToClients(clientMsg)
    broadCastToNodeServers(serverMsg)
  } else {
    logger.error('New client message discarded')
    //return JSON.stringify({ type: 'clientMessageResponse', payload: null })
  }
}


/**
 * Handles all incoming messages. Messages must be JSON formatted strings and
 * contain the fields: type (type), id (sender's id) and payload.
 * @param {string} object (message, json formatted string).
 * @returns {*} null/undefined or an JSON formatted string to return to the sender.
 */
const handle = async (address, object) => {
  const nodeId = getNodeId()
  if (!nodeId) {
    logger.error('handling message, nodeId is undefined')
    return null
  }

  if (!(synchronizer && broadCastToClients && broadCastToNodeServers)) {
    logger.error('SYNCHRONIZER or broadcast callbacks not installed')
  }

  if (object.charAt(0) !== '{') {
    logger.info(`RECEIVED message from ${address} -> [[${object}]]`)
    return
  }

  /** @type {SyncMessage} */
  const message = JSON.parse(object)
  logger.infoPrettyPrintObj(`RECEIVED message from ${address}:`, message)

  if (!Object.hasOwn(message, 'type')) {
    logger.error('Message type is missing. Ignoring!')
    return
  }
  if (!Object.hasOwn(message, 'payload') ||
    typeof message.payload === 'undefined' || message.payload === null
  ) {
    logger.error('Message payload is not defined. Ignoring!')
    return
  }

  switch (message.type) {
    case 'syncRequest': {
      const diff = await synchronizer.getMessageDiff(message.payload)
      return messageTypes.SyncReply(nodeId, diff)
    }

    case 'syncReply': {
      synchronizer.updateMessages(message.payload)
      return
    }

    case 'clientSyncRequest': {
      const clientDiff = await synchronizer.getMessageDiff(message.payload)
      return messageTypes.ClientSyncReply(nodeId, clientDiff)
    }

    case 'clientSyncReply': {
      logger.info('Message is of type: clientSyncReply. And I am a SERVER! Ignoring!')
      return
    }

    case 'newMessageFromClient': {
      await handleNewClientMessage(nodeId, message.payload) // TODO: Refactor to return response to client, if message was saved to DB or not
      return // TODO: return response to client
    }

    case 'newMessagesForClient': {
      logger.error('Message is of type: newMessagesForClient. And I am a SERVER! Ignoring!')
      return
    }

    case 'broadcastNewMessage': {
      const added = await addMessageToDatabase(message.payload)
      broadCastToClients(messageTypes.MessagesToClient(nodeId, added))
      return
    }

    default: {
      logger.error('Message type not recognized. Ignoring!')
    }
  }

}


/**
 * @param {Message} message
 * @returns {boolean}
 */
const addMessageToDatabase = async (message) => {
  await db.addMessageToDatabase(message)
  // db mutates message object, adds id and messageId
  return Object.hasOwn(message, 'id') && Object.hasOwn(message, 'messageId')
    ? message
    : undefined
}

module.exports = {
  installCallbacks,
  handle
}
