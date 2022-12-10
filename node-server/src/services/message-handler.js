const logger    = require('../../../common/utils/logger')
const db = require('./database')

let synchronizer = null

const installSynchronizer = (synchronizerObj) => {
  synchronizer = synchronizerObj
}

/**
 * Makes database querys and returns promises
 * @param {*} message
 * @returns {Promise<*>}
 * @private
 */
const handle = async (message) => {
  if (!synchronizer) {
    logger.error('SYNCHRONIZER not installed')
  }

  if (message.charAt(0) === '{') {
    const obj = JSON.parse(message)
    switch (message.query) {
      case 'syncRequest':
        const diff = await synchronizer.getMessageDiff(obj.payload)
        logger.info(`Sync request received: (${message})`)
        return JSON.stringify({ name: 'syncReply', payload: diff })
      case 'synchReply':
        return
      case 'clientSyncRequest':
        const diff = await synchronizer.getMessageDiff(obj.payload)
        logger.info(`Client Sync request received: (${message})`)
        return JSON.stringify({ name: 'clientSyncReply', payload: diff })
      case 'clientSynchReply':
        return
      case 'newMessageFromClient':
        return
      case 'newMessagesForClient':
        return
      case 'broadcastNewMessage':
        return
    }
  } else {
    logger.info(`RECEIVED message from ${getRemoteAddress(ws)} -> [[${message}]]`)
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