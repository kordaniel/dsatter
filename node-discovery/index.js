const logger     = require('../common/utils/logger')
const config     = require('./utils/config')
const middleware = require('./utils/middleware')

const express    = require('express')
const app        = express()

const dbService           = require('./database/database-service')
const nodeDiscoveryRouter = require('./controllers/nodes')
const clientsRouter       = require('./controllers/clients')

logger.info('Node-discovery service starting up')

const initialize = async () => {
  await dbService.initiateDatabase(config.DB_PATH_DISCOVERY)
  await dbService.openDatabaseConnection()
}

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/nodes', nodeDiscoveryRouter)
app.use('/api/clients', clientsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

initialize()
  .then(() => {
    app.listen(config.NODE_DISCOVERY_PORT, () => {
      logger.info(`Node discovery REST api running on port ${config.NODE_DISCOVERY_PORT}`)
    })
  })
  .catch(() => {
    logger.error('Init failed')
  })

// TODO: Add signal handler to capture closing events?
//  .finally(() => {
//    dbService.closeDataBaseConnection()
//  })
