const logger    = require('../../../common/utils/logger')

class Synchronizer {
  constructor(interval, dao, connService) {
    this.interval = interval
    this.dao = dao
    this.connService = connService
  }

  sync = () => {
    const latestMessages = this.dao.getLastMessageIds()
    logger.info('Synchronizing...')
    this.connService.broadcastToServers({ name: 'syncRequest', payload: latestMessages })
  }

  start = () => {
    logger.info(`Starting synchronizer with interval of ${this.interval}ms`)
    this.timer = setInterval(this.sync, this.interval)
  }

  // can make this smarter by running in single query
  getMessageDiff = (latestIds) => {
    const diff = {}
    latestIds.forEach(({node_id, id}) => {
      diff[nodeId] = this.dao.getMessagesAfter(nodeId, id)
    })

    return diff
  }

  updateMessages = (messageDiff) => {
    messageDiff.keys().forEach(key => {
      messageDiff[key].forEach(message => {
	this.dao.addNewMessage(message)
      })
    })
    logger.info(`Synchronization done`)
  }

  stop = () => {
    if(this.timer) {
      clearInterval(this.timer)
    }
  }
}

module.exports = Synchronizer
