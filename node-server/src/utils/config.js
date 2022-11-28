const commonConfig = require('../../../common/utils/config')

const NODE_DISCOVERY_URL  = commonConfig.NODE_DISCOVERY_URL
const NODE_DISCOVERY_PORT = commonConfig.NODE_DISCOVERY_PORT

const NODE_DEFAULT_PORT    = commonConfig.NODE_DEFAULT_PORT
const WS_PING_INTERVAL     = commonConfig.WS_PING_INTERVAL // ms
const MAX_EXPECTED_LATENCY = commonConfig.MAX_EXPECTED_LATENCY // timeout
const DISABLE_PORT_DANCING = true
const DB_PATH = commonConfig.DB_PATH



module.exports = {
  NODE_DISCOVERY_URL,
  NODE_DISCOVERY_PORT,
  NODE_DEFAULT_PORT,
  WS_PING_INTERVAL,
  MAX_EXPECTED_LATENCY,
  DISABLE_PORT_DANCING,
  DB_PATH
}
