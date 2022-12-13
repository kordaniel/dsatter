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
const {
  shallowEqual
} = require('../../../common/utils/helpers')

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


/**
 * Makes database querys and returns promises
 * @param {*} object
 * @returns {Promise<*>}
 * @private
 */
/* eslint-disable no-case-declarations */
const handle = async (address, object) => {
  if (!(synchronizer && broadCastToClients && broadCastToNodeServers)) {
    logger.error('SYNCHRONIZER or broadcast callbacks not installed')
  }

  if (object.charAt(0) === '{') {
    /** @type {SyncMessage} */
    const message = JSON.parse(object)
    switch (message.name) {
      case 'syncRequest':
        const diff = await synchronizer.getMessageDiff(message.payload)
        logger.info(`Sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'syncReply', payload: diff })

      case 'syncReply':
        logger.info(`Sync reply received from ${address}: ${message}`)
        synchronizer.updateMessages(message.payload)
        return

      case 'clientSyncRequest':
        const clientDiff = await synchronizer.getMessageDiff(message.payload)
        logger.info(`Client sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'clientSyncReply', payload: clientDiff })

      case 'clientSyncReply':
        logger.info(`Client sync reply received from ${address}: ${message}`)
        return

      case 'newMessageFromClient': {
        logger.info(`Message from a client received from ${address}:`, message)

        const nodeId = getNodeId()
        if (!nodeId) {
          logger.error('handling message from client, nodeId is undefined')
          return null
        }

        const msg = {
          //id DATABASE creates id, message_id
          nodeId,
          ...message.payload, //text, sender, chatId
          dateTime: new Date().toJSON()
        }

        const added = await addMessageToDatabase(msg)

        if (!shallowEqual(msg, added)) {
          logger.error('---------------------------------')
          logger.error('Saved object differs from created')
          logger.error('---------------------------------')
        }

        if (added) {
          logger.debug('ADDED:', added)
          const clientMsg = messageTypes.MessagesToClient(added)
          const serverMsg = messageTypes.ShoutBroadcast(added)
          logger.debug('CLIENT MSG:', clientMsg)
          logger.debug('SERVER MSG:', serverMsg)
          broadCastToClients(clientMsg)
          broadCastToNodeServers(serverMsg) // must be a single message
          return // messageTypes.ClientMessageResponse(added)
        } else {
          //return JSON.stringify({ name: 'clientMessageResponse', payload: null })
          return
        }
      }
      case 'newMessagesForClient':
        logger.info(`Messages for clients received from ${address}:`, message)
        return

      case 'broadcastNewMessage': {
        logger.info(`Message for broadcasting received from ${address}:`, message)
        const added = await addMessageToDatabase(message.payload)

        if (!shallowEqual(added, message.payload)) {
          logger.error('---------------------------------')
          logger.error('Saved object differs from created')
          logger.error('---------------------------------')
        }
        logger.debug('MESSAGE FROM OTHER SERVERS SAVED:', added)
        broadCastToClients(messageTypes.MessagesToClient(added))
        return
      }
      default:
        logger.info(`RECEIVED message from ${address}: ${message}`)
    }
  } else {
    logger.info(`RECEIVED message from ${address} -> [[${object}]]`)
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
