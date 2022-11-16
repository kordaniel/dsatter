const config = require('../utils/config')
const logger = require('../../common/utils/logger')

const axios = require('axios')

const baseUrl = `${config.NODE_DISCOVERY_URL}:${config.NODE_DISCOVERY_PORT}/api/nodes/active`

const getActiveNodes = async () => {
  try {
    const res = await axios.get(baseUrl)
    return res.data
  } catch (err) {
    logger.error('performing GET request:', err.cause)
    throw Error(err)
  }
}

const registerAsActive = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/register`, { 'port': port })
    return res.data
  } catch (err) {
    logger.error('performing POST register active:', err.cause)
    throw Error(err)
  }
}

const unregisterAsActive = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/unregister`, { 'port': port })
    return res.data
  } catch (err) {
    logger.error('performing POST unregister active:', err.cause)
    throw Error(err)
  }
}

const reportUnreachable = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/reportUnreachable`, { 'port': port })
    return res.data
  } catch (err) {
    logger.error('performing POST reportUnreachable', err.cause)
    throw Error(err)
  }
}

module.exports = {
  getActiveNodes,
  registerAsActive,
  unregisterAsActive,
  reportUnreachable
}
