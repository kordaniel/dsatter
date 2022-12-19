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

const registerAsActive = async (nodeId, password, syncport, clientport) => {
  try {
    const res = await axios.post(`${baseUrl}/active/login`, {
      'id': nodeId,
      password,
      syncport,
      clientport
    })
    return res.data
  } catch (err) {
    logger.error('performing POST register active:', err.cause)
    throw Error(err)
  }
}

const unregisterAsActive = async (nodeId, password) => {
  try {
    const res = await axios.post(`${baseUrl}/active/logout`, {
      'id': nodeId,
      password
    })
    return res.data
  } catch (err) {
    logger.error('performing POST unregister active:', err.cause)
    throw Error(err)
  }
}

const registerNode = async (password) => {
  // query for a new fresh ID
  try {
    const res = await axios.post(`${baseUrl}/register`, { password })
    return res.data
  } catch (err) {
    logger.error('performing POST register new node:', err.cause)
    throw Error(err)
  }
}

module.exports = {
  getActiveNodes,
  registerAsActive,
  unregisterAsActive,
  registerNode
}
