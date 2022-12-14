const logger    = require('../../../common/utils/logger')

class Synchronizer {
  constructor(interval, db, connService) {
    this.interval = interval
    this.db = db
    this.connService = connService
  }

  sync = async () => {
    const latestMessages = await this.db.getLastMessageIds()
    let latestByNodeId = {}
    latestMessages.forEach(obj => { latestByNodeId[obj.nodeId] = obj.nodeId })

    logger.debugPrettyPrintObj(
      'Synchronizing... Last message ids:',
      latestByNodeId,
      'sending syncRequest to all node servers'
    )

    this.connService.broadcastToNodeServers({ name: 'syncRequest', payload: latestByNodeId })
  }

  start = () => {
    logger.info(`Starting synchronizer with interval of ${this.interval}ms`)
    this.timer = setInterval(this.sync, this.interval)
  }

  // can make this smarter by running in single query
  getMessageDiff = async (latestIds) => {
    logger.debug('Synchronizer: procesing sync request...')

    const diff = {}
    let knownIds = await this.db.getNodeIds()
    logger.debugPrettyPrintObj('Known nodeId:s in DB:', knownIds)

    const sentIds = Object.keys(latestIds)

    await Promise.all(knownIds.map(async ({ nodeId }) => {
      diff[nodeId] = await this.db.getMessagesAfter(nodeId, sentIds.includes(nodeId) ? latestIds[nodeId] : 0)
    }))

    logger.debugPrettyPrintObj('Sync diff generated, diff:', diff)

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
    if(this.timer) {
      clearInterval(this.timer)
    }
  }
}

module.exports = Synchronizer
