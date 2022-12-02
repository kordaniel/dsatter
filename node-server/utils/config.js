const commonConfig = require('../../common/utils/config')

const NODE_DISCOVERY_URL  = commonConfig.NODE_DISCOVERY_URL
const NODE_DISCOVERY_PORT = commonConfig.NODE_DISCOVERY_PORT

const NODE_DEFAULT_SERV_WS_PORT = commonConfig.NODE_DEFAULT_SERV_WS_PORT
const NODE_DEFAULT_CLIENT_WS_PORT = commonConfig.NODE_DEFAULT_CLIENT_WS_PORT

const WS_PING_INTERVAL     = commonConfig.WS_PING_INTERVAL // ms
const MAX_EXPECTED_LATENCY = commonConfig.MAX_EXPECTED_LATENCY // timeout
const DISABLE_PORT_DANCING = process.env.NODE_ENV !== 'development' // use port dancing when running in development environment



module.exports = {
  NODE_DISCOVERY_URL,
  NODE_DISCOVERY_PORT,
  NODE_DEFAULT_SERV_WS_PORT,
  NODE_DEFAULT_CLIENT_WS_PORT,
  WS_PING_INTERVAL,
  MAX_EXPECTED_LATENCY,
  DISABLE_PORT_DANCING
}
