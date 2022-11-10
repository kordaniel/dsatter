const config = require('../utils/config')
const logger = require('../utils/logger')

const axios = require('axios')

const baseUrl = `${config.NODE_DISCOVERY_URL}:${config.NODE_DISCOVERY_PORT}/api/nodes/active`

const getActiveNodes = async () => {
  try {
    const res = await axios.get(baseUrl)
    return res.data
  } catch (err) {
    logger.error('performing GET request:', err)
    throw Error(err)
  }
}

const registerAsActive = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/register`, { 'port': port })
    return res
  } catch (err) {
    logger.error('performing POST register active:', err)
    throw Error(err)
  }
}

const unregisterAsActive = async (port) => {
  try {
    const res = await axios.post(`${baseUrl}/unregister`, { 'port': port })
    return res
  } catch (err) {
    logger.error('performing POST unregister active:', err)
    throw Error(err)
  }
}

module.exports = {
  getActiveNodes,
  registerAsActive,
  unregisterAsActive
}
