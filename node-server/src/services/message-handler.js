/**
 * Handles synchronization messages recieved from clients and other servers
 * @typedef {import(../../../common/types/datatypes).SyncMessage} SyncMessage
 */

const logger       = require('../../../common/utils/logger')
const db           = require('./database')
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


const handleNewClientMessage = async (message) => {
  const nodeId = getNodeId()
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
    const clientMsg = messageTypes.MessagesToClient(added)
    const serverMsg = messageTypes.ShoutBroadcast(added)
    broadCastToClients(clientMsg)
    broadCastToNodeServers(serverMsg)
  } else {
    logger.error('New client message discarded')
    //return JSON.stringify({ name: 'clientMessageResponse', payload: null })
  }
}


/**
 * Handles all incoming messages. Messages must be JSON formatted strings and
 * contain the fields: name (type) and payload.
 * @param {string} object (message, json formatted string).
 * @returns {*} null/undefined or an JSON formatted string to return to the sender.
 */
const handle = async (address, object) => {
  if (!(synchronizer && broadCastToClients && broadCastToNodeServers)) {
    logger.error('SYNCHRONIZER or broadcast callbacks not installed')
  }

  if (object.charAt(0) !== '{') {
    logger.info(`RECEIVED message from ${address} -> [[${object}]]`)
    return
  }

  logger.debug('JOOOOOOOOOOOOOOOOOOOOO')

  /** @type {SyncMessage} */
  const message = JSON.parse(object)
  logger.infoPrettyPrintObj(`RECEIVED message from ${address}:`, message)

  if (!Object.hasOwn(message, 'name')) {
    logger.error('The type of the message is missing (name property). Ignoring!')
    return
  }
  if (!Object.hasOwn(message, 'payload') ||
      typeof message.payload === 'undefined' ||
      message.payload === null) {
    logger.error('Message payload is not defined. Ignoring!')
    return
  }

  switch (message.name) {
    case 'syncRequest': {
      const diff = await synchronizer.getMessageDiff(message.payload)
      return JSON.stringify({ name: 'syncReply', payload: diff })
    }

    case 'syncReply': {
      synchronizer.updateMessages(message.payload)
      return
    }

    case 'clientSyncRequest': {
      const clientDiff = await synchronizer.getMessageDiff(message.payload)
      return JSON.stringify({ name: 'clientSyncReply', payload: clientDiff })
    }

    case 'clientSyncReply': {
      logger.info('Message is of type: clientSyncReply. And I am a SERVER! Ignoring!')
      return
    }

    case 'newMessageFromClient': {
      await handleNewClientMessage(message.payload) // TODO: Refactor to return response to client, if message was saved to DB or not
      return // TODO: return response to client
    }

    case 'newMessagesForClient': {
      logger.error('Message is of type: newMessagesForClient. And I am a SERVER! Ignoring!')
      return
    }

    case 'broadcastNewMessage': {
      const added = await addMessageToDatabase(message.payload)
      broadCastToClients(messageTypes.MessagesToClient(added))
      return
    }

    default: {
      logger.error('Message name (type) not recognized. Ignoring!')
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
