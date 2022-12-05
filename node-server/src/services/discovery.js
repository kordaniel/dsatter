const config = require('../utils/config')
const logger = require('../../../common/utils/logger')

const axios = require('axios')

const baseUrl = `${config.NODE_DISCOVERY_URL}:${config.NODE_DISCOVERY_PORT}/api/nodes`

const getActiveNodes = async () => {
  try {
    const res = await axios.get(`${baseUrl}/active`)
    return res.data
  } catch (err) {
    logger.error('performing GET request:', err.cause)
    throw Error(err)
  }
}

const registerAsActive = async (serverWsPort, clientWsPort) => {
  try {
    const res = await axios.post(`${baseUrl}/active/login`, {
      'serverPort': serverWsPort,
      'clientPort': clientWsPort
    })
    return res.data
  } catch (err) {
    logger.error('performing POST register active:', err.cause)
    throw Error(err)
  }
}

const unregisterAsActive = async (serverWsPort, clientWsPort) => {
  // TODO: Use token/credentials to identify node instead of port
  try {
    const res = await axios.post(`${baseUrl}/active/logout`, {
      'serverPort': serverWsPort,
      'clientPort': clientWsPort
    })
    return res.data
  } catch (err) {
    logger.error('performing POST unregister active:', err.cause)
    throw Error(err)
  }
}

const registerNode = async () => {
  // query for a new fresh ID
  try {
    const res = await axios.post(`${baseUrl}/register`, { })
    return res.data
  } catch (err) {
    logger.err('performing POST register new node:', err.cause)
    throw Error(err)
  }
}

/*
const reportUnreachable = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/reportUnreachable`, { 'port': port })
    return res.data
  } catch (err) {
    logger.error('performing POST reportUnreachable', err.cause)
    throw Error(err)
  }
}
*/

module.exports = {
  getActiveNodes,
  registerAsActive,
  unregisterAsActive,
  registerNode
}
