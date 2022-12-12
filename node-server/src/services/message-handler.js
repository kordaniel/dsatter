/**
 * Handles synchronization messages recieved from clients and other servers
 * @typedef {import(../../../common/types/datatypes).SyncMessage} SyncMessage
 */

const logger    = require('../../../common/utils/logger')
const db = require('./database')
const {
  getNodeId
} = require('../state/node')
let synchronizer = null

const installSynchronizer = (synchronizerObj) => {
  synchronizer = synchronizerObj
}

/**
 * Makes database querys and returns promises
 * @param {*} object
 * @returns {Promise<*>}
 * @private
 */
/* eslint-disable no-case-declarations */
const handle = async (address, object) => {
  if (!synchronizer) {
    logger.error('SYNCHRONIZER not installed')
  }

  if (object.charAt(0) === '{') {
    /** @type  */
    const message = JSON.parse(object)
    switch (message.name) {
      case 'syncRequest':
        const diff = await synchronizer.getMessageDiff(message.payload)
        logger.info(`Sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'syncReply', payload: diff })

      case 'synchReply':
        logger.info(`Sync reply received from ${address}: ${message}`)
        synchronizer.updateMessages(message.payload)
        return
        
      case 'clientSyncRequest':
        const clientDiff = await synchronizer.getMessageDiff(message.payload)
        logger.info(`Client sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'clientSyncReply', payload: clientDiff })

      case 'clientSynchReply':
        logger.info(`Client sync reply received from ${address}: ${message}`)
        return

      case 'newMessageFromClient':
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
        if (added) {
          return JSON.stringify({ name: 'clientMessageResponse', payload: added })
        } else {
          return
        }

      case 'newMessagesForClient':
        logger.info(`Messages for clients received from ${address}: ${message}`)
        return

      case 'broadcastNewMessage':
        logger.info(`Message for broadcasting received from ${address}: ${message}`)
        return
        
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
  installSynchronizer,
  handle
}