const assert = require('assert')
const config = require('../utils/config')
const logger = require('../../common/utils/logger')
const {
  isNonEmptyArray, sleep, randomInt
}            = require('../../common/utils/helpers')

const discoveryService = require('../services/discovery')

let listenPort = -1
let otherNodes = []

const getPortCandidate = () => {
  if(config.DISABLE_PORT_DANCING) {
    return config.NODE_DEFAULT_PORT
  }
  return config.NODE_DEFAULT_PORT + randomInt(0, 1000)
}

const cleanup = (activeNodes) => {
  listenPort = -1
  otherNodes = isNonEmptyArray(activeNodes)
    ? [ ...activeNodes ]
    : []
}

const setListenPort = (port) => {
  listenPort = port
}

const setOtherNodes = (activeNodes) => {
  otherNodes = isNonEmptyArray(activeNodes)
    ? [ ...activeNodes ]
    : []
}

const removeFromOtherActiveNodes = (port) => {
  otherNodes = otherNodes.filter(p => p !== port)
  // TODO: Inform discovery service node at port is unreachable
}

const initialize = async (ownPort) => {
  assert(listenPort === -1, 'Attempted to reinitialize state/node')

  const sleepTimeMaxMs = 4 * 1000
  let sleepTimeMs = 500
  let wasRegistered = false

  do {
    try {
      const activeNodesArr = await discoveryService.getActiveNodes()
      const proposedPort   = ownPort > -1 ? ownPort : getPortCandidate()
      const regRes         = await discoveryService.registerAsActive(proposedPort)

      if (regRes.wasRegistered) {
        setListenPort(proposedPort)
        setOtherNodes(regRes.activeNodes)
        wasRegistered = true
      } else {
        logger.info(`Registration failed, sleeping for ${sleepTimeMs}ms before trying again`)
        await sleep(sleepTimeMs)
        sleepTimeMs = Math.min(sleepTimeMs + sleepTimeMs, sleepTimeMaxMs)
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
  try {
    const unregRes = await discoveryService.unregisterAsActive(listenPort)
    cleanup(unregRes.activeNodes)
    return unregRes.wasUnregistered
  } catch (err) {
    logger.error('node/state, close():', err)
  }
}

const getListenPort = () => listenPort
const getOtherActiveNodes = () => [ ...otherNodes ]

module.exports = {
  removeFromOtherActiveNodes,
  initialize,
  close,
  getListenPort,
  getOtherActiveNodes
}
