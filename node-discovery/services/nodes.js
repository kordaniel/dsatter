// Module containing the state of the registered running nodes

let activeNodes = [ ]

/**
 * Register a new node
 * @param {*} ip the port of the node
 * @param {*} port the listening port of the node
 * @returns true, if node was not already registered. false otherwise
 */
const registerNode = (ip, port) => {
  const socket = `${ip}:${port}`
  if (activeNodes.includes(socket)) return false

  activeNodes = activeNodes
    .concat(socket)
    .sort((a,b) => a-b)

  return true
}

/**
 * Remove a node from the running nodes array
 * @param {*} ip the ip of the node
 * @param {*} port the listening port of the node
 * @returns true, if node was running and thus removed. false otherwise.
 */
const unregisterNode = (ip, port) => {
  const socket = `${ip}:${port}`
  if (!activeNodes.includes(socket)) return false

  activeNodes = activeNodes.filter(n => n !== socket)
  return true
}

const getNodes = () => {
  return [ ...activeNodes ]
}

module.exports = {
  registerNode,
  unregisterNode,
  getNodes
}
