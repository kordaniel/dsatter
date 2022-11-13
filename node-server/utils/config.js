// Lots of garbage in here for now (git is tricky).
// TODO: cleanup when websocket is implemented.

const DEV_ENV = process.env.NODE_ENV === 'development'

const CONFIG_TEST_MSG = DEV_ENV
  ? 'Hello developers (running in dev environment)'
  : 'Hello world (running in production environment)'

const NODE_DISCOVERY_URL = 'http://localhost'
const NODE_DISCOVERY_PORT = 8080

const NODE_DEFAULT_PORT = 49152
const WS_PING_INTERVAL = 5000 // ms
const MAX_EXPECTED_LATENCY = 3000

const PORTS = {
  listen: undefined,
  connect: undefined
}

const setPort = (key, port) => {
  PORTS[key] = port
}

const getPort = (key) => {
  return key in PORTS
    ? PORTS[key]
    : null
}

/**
 * Parses command line arguments and also updates the configuration based
 * on the values specified.
 * @param {*} args array of string containing the command line arguments.
 * @returns {bool} true if all required arguments were specified. false otherwise.
 */
const parseArgs = (args) => {
  const requiredFields = [ 'listen', 'connect' ]

  const ports = args
    .map(a => a.trim())
    .filter(a => a.startsWith('--'))
    .reduce((acc, arg) => {
      const [key, val] = arg.slice(2).split('=')

      if (Number(val)) {
        acc[key] = Number(val)
      }

      return acc
    }, {})

  for (const field of requiredFields) {
    if (!(field in ports)) {
      return false
    }
    setPort(field, ports[field])
  }

  return true
}

module.exports = {
  DEV_ENV,
  CONFIG_TEST_MSG,
  NODE_DISCOVERY_URL,
  NODE_DISCOVERY_PORT,
  NODE_DEFAULT_PORT,
  WS_PING_INTERVAL,
  MAX_EXPECTED_LATENCY,
  setPort,
  getPort,
  parseArgs
}
