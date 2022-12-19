const logger = require('../../../common/utils/logger')

class Synchronizer {
  constructor(interval, db, connService) {
    this.interval = interval
    this.db = db
    this.connService = connService
  }

  sync = async () => {
    const latestMessages = await this.db.getLastMessageIds()
    let latestByNodeId = {}
    latestMessages.forEach((obj) => {
      latestByNodeId[obj.nodeId] = obj.maxId })
    logger.debugPrettyPrintObj(
      'Synchronizing... Last message ids:',
      latestByNodeId,
      'sending syncRequest to all node servers'
    )

    this.connService.broadcastToNodeServers({ type: 'syncRequest', payload: latestByNodeId })
  }

  start = () => {
    logger.info(`Starting synchronizer with interval of ${this.interval}ms`)
    this.timer = setInterval(this.sync, this.interval)
  }

  // can make this smarter by running in single query
  getMessageDiff = async (latestIds) => {
    logger.debug('Synchronizer: procesing sync request...')
    const diff = {}
    const knownIds = await this.db.getNodeIds()
    const sentIds = Object.keys(latestIds).map(key => Number(key))
    await Promise.all(knownIds.map(async ({ nodeId }) => {
      diff[nodeId] = await this.db.getMessagesAfter(nodeId,
        sentIds.includes(nodeId) ? latestIds[nodeId] : 0)
    }))
    const list = {}
    Object.keys(diff).forEach(key => {
      list[key] = diff[key].map(m => m.id)
    })
    logger.debugPrettyPrintObj('Sync diff generated, diff:', list)
    return diff
  }

  updateMessages = (messageDiff) => {
    let messageCount = 0
    Object.keys(messageDiff).forEach(key => {
      messageDiff[key].forEach(message => {
        this.db.addMessageToDatabase(message)
        messageCount++
      })
    })
    logger.debug(`Synchronization done, ${messageCount} messages synchronized`)
  }

  stop = () => {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}

module.exports = Synchronizer
