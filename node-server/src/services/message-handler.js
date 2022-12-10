const logger    = require('../../../common/utils/logger')
const db = require('./database')

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
const handle = async (address, object) => {
  if (!synchronizer) {
    logger.error('SYNCHRONIZER not installed')
  }

  if (object.charAt(0) === '{') {
    const message = JSON.parse(object)
    switch (message.name) {
      case 'syncRequest':
        const diff = await synchronizer.getMessageDiff(message.payload)
        logger.info(`Sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'syncReply', payload: diff })
      case 'synchReply':
        logger.info(`Sync reply received from ${address}: ${message}`)
        synchronizer.updateMessages(message.payload)
        break
      case 'clientSyncRequest':
        const diff = await synchronizer.getMessageDiff(obj.payload)
        logger.info(`Client sync request received from ${address}: ${message}`)
        return JSON.stringify({ name: 'clientSyncReply', payload: diff })
      case 'clientSynchReply':
        logger.info(`Client sync reply received from ${address}: ${message}`)
        break
      case 'newMessageFromClient':
        logger.info(`Message from a client received from ${address}: ${message}`)
        return
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
 * 
 * @param {Message} message 
 */
const addMessageToDatabase = async (message) => {
    await db.addMessageToDatabase(message)
    const saved = await db.searchMessageDatabase(messageId)
    if (saved.id === message.id && saved.dateTime === message.dateTime)
        return true
}

module.exports = {
  installSynchronizer,
  handle
}