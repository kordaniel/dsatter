const logger     = require('./utils/logger')
const config     = require('./utils/config')
const middleware = require('./utils/middleware')

const express    = require('express')
const app        = express()

const nodeDiscoveryRouter = require('./controllers/nodes')

logger.info('Node-discovery service starting up')

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/nodes', nodeDiscoveryRouter)

app.use(middleware.unknownEndpoint)

app.listen(config.NODE_DISCOVERY_PORT, () => {
  logger.info(`Node discovery REST api running on part ${config.NODE_DISCOVERY_PORT}`)
})
