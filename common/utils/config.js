/**
 * Module to store common constants or other configs.
 *
 * This module is defined outside any npm project, so one must take
 * that into consideration if using any external dependencies inside
 * this module.
 */

const NODE_DISCOVERY_URL  = process.env.NODE_ENV === 'development'
  ? 'http://localhost'
  : 'http://dsatter-discovery'
const NODE_DISCOVERY_PORT = 8080
const NODE_DISCOVERY_PATH_CLIENT = 'api/clients'

const NODE_DEFAULT_SERV_WS_PORT = 49152
const NODE_DEFAULT_CLIENT_WS_PORT = 55000
const WS_PING_INTERVAL     = 5000 // ms
const MAX_EXPECTED_LATENCY = 3000 // timeout
const DB_PATH = process.env.NODE_ENV === 'development' ? './dsatter.db' : '/db/dsatter.db'

module.exports = {
  NODE_DISCOVERY_URL,
  NODE_DISCOVERY_PORT,
  NODE_DEFAULT_SERV_WS_PORT,
  NODE_DEFAULT_CLIENT_WS_PORT,
  WS_PING_INTERVAL,
  MAX_EXPECTED_LATENCY,
  DB_PATH
}
