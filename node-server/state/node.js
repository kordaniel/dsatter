const config = require('../utils/config')
const logger = require('../utils/logger')
const {
  isNonEmptyArray
}            = require('../utils/helpers')

const discoveryService = require('../services/discovery')

let listenPort = -1
let otherNodes = []

const setup = (activeNodes) => {
  let proposedPort = config.NODE_DEFAULT_PORT

  if (isNonEmptyArray(activeNodes)) {
    while (activeNodes.includes(proposedPort)) {
      proposedPort += 1
    }
    otherNodes = [ ...activeNodes ]
  } else {
    otherNodes = []
  }

  listenPort = proposedPort
}

const cleanup = (activeNodes) => {
  listenPort = -1
  otherNodes = isNonEmptyArray(activeNodes)
    ? [ ...activeNodes ]
    : []
}

const initialize = async () => {
  // TODO: Add error handling for discovery service unreachable (ECONNREFUSED error)
  let wasRegistered = false

  try {
    while (!wasRegistered) {
      const activeNodesArr = await discoveryService.getActiveNodes()
      setup(activeNodesArr)

      const regRes = await discoveryService.registerAsActive(listenPort)
      wasRegistered = regRes.data.wasRegistered !== false // false or integer

      // TODO: assert regRes.data.activeNodes === otherNodes
    }
  } catch (err) {
    logger.error('state/node initialize():', err)
  }
}

const close = async () => {
  try {
    const unregRes = await discoveryService.unregisterAsActive(listenPort)
    cleanup(unregRes.data.activeNodes)
    return unregRes.data.wasUnregistered
  } catch (err) {
    logger.error('node/state, close():', err)
  }
}

const getListenPort = () => listenPort
const getOtherActiveNodes = () => [ ...otherNodes ]

module.exports = {
  initialize,
  close,
  getListenPort,
  getOtherActiveNodes
}
