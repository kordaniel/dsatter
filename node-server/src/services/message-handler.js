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
    if (obj.name === 'syncRequest') {
      const diff = await synchronizer.getMessageDiff(obj.payload)
      logger.info(`Sync request received: (${message})`)
      return diff
    }
  }
  
  // switch (message.query) {
  //   case 'addMessage':
  //     return db.addMessageToDatabase(message.data)
  //   case 'addChat':
  //     return db.addChatToDatabase(message.data)
  //   case 'searchMessages':
  //     return db.searchMessageDatabase(message.data)
  //   case 'searchChats':
  //     return db.searchChatDatabase(message.data)
  // }
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