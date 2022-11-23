/**
 * Module to store common constants or other configs.
 *
 * This module is defined outside any npm project, so one must take
 * that into consideration if using any external dependencies inside
 * this module.
 */

const NODE_DISCOVERY_URL  = 'http://dsatter-discovery'
const NODE_DISCOVERY_PORT = 8080

const NODE_DEFAULT_PORT    = 49152
const WS_PING_INTERVAL     = 5000 // ms
const MAX_EXPECTED_LATENCY = 3000 // timeout

module.exports = {
  NODE_DISCOVERY_URL,
  NODE_DISCOVERY_PORT,
  NODE_DEFAULT_PORT,
  WS_PING_INTERVAL,
  MAX_EXPECTED_LATENCY
}
