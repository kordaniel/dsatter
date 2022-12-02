const assert = require('assert')
const config = require('../utils/config')
const logger = require('../../../common/utils/logger')
const {
  isNonEmptyArray,
  sleep,
  randomInt,
  shallowEqual
}            = require('../../../common/utils/helpers')


const discoveryService = require('../services/discovery')

let listenPortWsServers = -1
let listenPortWsClients = -1
let otherNodes = []

const getPortCandidate = (port, range = 1000) => {
  if (config.DISABLE_PORT_DANCING) {
    return port
  }

  return port + randomInt(0, range)
}

const cleanup = (activeNodes) => {
  listenPortWsServers = -1
  listenPortWsClients = -1
  setOtherNodes(activeNodes)
}

const setListenPortWsServers = (port) => {
  listenPortWsServers = port
}

const setListenPortWsClients = (port) => {
  listenPortWsClients = port
}

const setOtherNodes = (activeNodes) => {
  otherNodes = isNonEmptyArray(activeNodes)
    ? [ ...activeNodes ]
    : []
}

const removeFromOtherActiveNodes = (socket) => {
  otherNodes = otherNodes.filter(node => !shallowEqual(node, socket))
  // TODO: Inform discovery service node that 'node' is unreachable
}

const initialize = async (listenWsServerPort, listenWsClientPort) => {
  assert(listenPortWsServers === -1, 'Attempted to reinitialize state/node')
  assert(listenPortWsClients === -1, 'Attempted to reinitialize state/node')

  const sleepTimeMaxMs = 4 * 1000
  let sleepTimeMs = 500
  let wasRegistered = false

  let serverWsPort = getPortCandidate(listenWsServerPort, 1000)
  let clientWsPort = getPortCandidate(listenWsClientPort, 1000)

  do {
    try {
      const regRes = await discoveryService.registerAsActive(serverWsPort, clientWsPort)

      if (regRes.address === false) {
        logger.info(`Registration failed, sleeping for ${sleepTimeMs}ms before trying again`)
        await sleep(sleepTimeMs)
        sleepTimeMs = Math.min(sleepTimeMs + sleepTimeMs, sleepTimeMaxMs)
      } else {
        setListenPortWsServers(regRes.serverPort)
        setListenPortWsClients(regRes.clientPort)
        setOtherNodes(regRes.activeNodes)
        wasRegistered = true
      }
    } catch (err) {
      logger.error('state/node initialize():', err)
      logger.info(`Registration failed with error, sleeping for ${sleepTimeMs}ms before trying again`)
      await sleep(sleepTimeMs)
      sleepTimeMs = Math.min(sleepTimeMs + sleepTimeMs, sleepTimeMaxMs)
    }

  } while (!wasRegistered)
}

const close = async () => {
  // TODO: Add error handling. Discovery is unreachable, unregistration failed etc
  try {
    const unregRes = await discoveryService.unregisterAsActive(
      getListenPortWsServers(),
      getListenPortWsClients()
    )
    cleanup(unregRes.activeNodes)
    return unregRes.wasUnregistered
  } catch (err) {
    logger.error('node/state, close():', err)
  }
}

const getListenPortWsServers = () => listenPortWsServers
const getListenPortWsClients = () => listenPortWsClients
const getOtherActiveNodes = () => [ ...otherNodes ]

module.exports = {
  initialize,
  removeFromOtherActiveNodes,
  close,
  getListenPortWsServers,
  getListenPortWsClients,
  getOtherActiveNodes
}
