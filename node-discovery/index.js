const config     = require('../common/utils/config')
const logger     = require('../common/utils/logger')
const middleware = require('./utils/middleware')

const express    = require('express')
const app        = express()

const nodeDiscoveryRouter = require('./controllers/nodes')
const clientsRouter       = require('./controllers/clients')

logger.info('Node-discovery service starting up')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/nodes', nodeDiscoveryRouter)
app.use('/api/clients', clientsRouter)

app.use(middleware.unknownEndpoint)

app.listen(config.NODE_DISCOVERY_PORT, () => {
  logger.info(`Node discovery REST api running on port ${config.NODE_DISCOVERY_PORT}`)
})
