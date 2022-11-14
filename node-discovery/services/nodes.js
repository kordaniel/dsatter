// Module containing the state of the registered running nodes
// - only ports for now..

let activeNodes = [ ]

/**
 * Register a new node
 * @param {*} port the listening port of the node
 * @returns true, if node was not already registered. false otherwise
 */
const registerNode = (port) => {
  if (activeNodes.includes(port)) return false

  activeNodes = activeNodes
    .concat(port)
    .sort((a,b) => a-b)

  return true
}

/**
 * Remove a node from the running nodes array
 * @param {*} port the listening port of the node
 * @returns true, if node was running and thus removed. false otherwise.
 */
const unregisterNode = (port) => {
  if (!activeNodes.includes(port)) return false

  activeNodes = activeNodes.filter(n => n !== port)
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
