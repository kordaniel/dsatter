// add and use dotenv

const DEV_ENV = process.env.NODE_ENV === 'development'

const CONFIG_TEST_MSG = DEV_ENV
  ? 'Hello developers (running in dev environment)'
  : 'Hello world (running in production environment)'

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
  setPort,
  getPort,
  parseArgs
}
