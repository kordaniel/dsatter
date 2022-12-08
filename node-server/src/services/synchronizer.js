const logger    = require('../../../common/utils/logger')

class Synchronizer {
  constructor(interval, db, connService) {
    this.interval = interval
    this.db = db
    this.connService = connService
  }

  sync = async () => {
    let latestMessages = await this.db.getLastMessageIds()
    if (!Array.isArray(latestMessages)) {
      if (!latestMessages.node_id) {
        latestMessages = []
      } else {
        latestMessages = [latestMessages]
      }
    }
    let latestByNodeId = {}
    latestMessages.forEach(obj => { latestByNodeId[obj.node_id] = obj['MAX(id)'] })
    logger.info(`Synchronizing... Last message ids: ${JSON.stringify(latestByNodeId)}`)

    this.connService.broadcastToNodeServers(JSON.stringify({ name: 'syncRequest', payload: latestByNodeId }))
  }

  start = () => {
    logger.info(`Starting synchronizer with interval of ${this.interval}ms`)
    this.timer = setInterval(this.sync, this.interval)
  }

  // can make this smarter by running in single query
  getMessageDiff = async (latestIds) => {
    logger.info(`Processing sync request, diff: ${JSON.stringify(latestIds)}`)
    const diff = {}
    let knownIds = await this.db.getNodeIds()
    logger.info(`Known node ids in DB: ${JSON.stringify(knownIds)}`)
    const sentIds = Object.keys(latestIds)
    logger.info(`Sent ids in request: ${JSON.stringify(sentIds)}`)
    await Promise.all(knownIds.map(async ({ node_id }) => {
      const nodeId = '' + node_id
      diff[node_id] = await this.db.getMessagesAfter(node_id, sentIds.includes(nodeId) ? latestIds[nodeId] : 0)
    }))

    logger.info(`Sync diff generated, diff: ${JSON.stringify(diff)}.`)

    return diff
  }

  updateMessages = (messageDiff) => {
    logger.info(`Received sync response, diff: ${JSON.stringify(messageDiff)}`)
    let messageCount = 0
    Object.keys(messageDiff).forEach(key => {
      messageDiff[key].forEach(message => {
        const dbMessage = {
          nodeId: message.node_id,
          id: message.id,
          messageId: message.messageId,
          text: message.messageText,
          dateTime: message.messageDateTime,
          sender: message.messageSender,
          chat_id: message.chat_id
        }
        this.db.addMessageToDatabase(dbMessage)
        messageCount++
      })
    })
    logger.info(`Synchronization done, ${messageCount} messages synchronized`)
  }

  stop = () => {
    if(this.timer) {
      clearInterval(this.timer)
    }
  }
}

module.exports = Synchronizer
