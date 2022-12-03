// Module containing the state of the registered running nodes

const {
  isEmptyArray,
  isNonEmptyArray,
  shallowEqual
} = require('../../common/utils/helpers')

let activeNodes = []

/**
 * Helper function to create node objects.
 * @param {string} ip The ip/address of the node.
 * @param {Number} serverWsPort The listening port of the node for other server nodes.
 * @param {Number} clientWsPort The listening port of the node for clients.
 * @returns {Object} Containing the data of the node
 */
const NodeObject = (ip, serverWsPort, clientWsPort) => {
  return {
    address: ip,
    portServer: serverWsPort,
    portClient: clientWsPort
  }
}

/**
 * Filters the activeNodes array against one object passed as argument.
 * @param {object[]} arr Array containing node objects.
 * @param {object} targetObj The object to match against.
 * @param {bool} strict If true, match on both ports (while unregistering), false match any port (registering phase)
 * @returns {Object[]} Filtered array of node objects.
 */
const filterMatching = (arr, targetObj, strict) => {
  // NOTE: When running in production mode, need to take adress and port(s) combinations
  //       into account when comparing nodes.
  // TODO: REGISTER AND FILTER NODES BY THEIR CREDENTIALS instead of this hack
  return process.env.NODE_ENV !== 'development'
    ? arr.filter(element => shallowEqual(element, targetObj))
    : arr.filter(element =>
      // ignore address in dev env since all nodes are running on localhost
      // and match only on port numbers
      strict
        ? element.portServer === targetObj.portServer &&
          element.portClient === targetObj.portClient
        : element.portServer === targetObj.portServer ||
          element.portClient === targetObj.portClient
    )
}

/**
 * Attempt to register a new running node.
 * @param {string} ip The ip/address of the node.
 * @param {Number} serverWsPort The listening WS port for other server nodes.
 * @param {Number} clientWsPort The listening WS port for clients.
 * @returns {bool} true, if node was not already registered. false otherwise.
 */
const registerNode = (ip, serverWsPort, clientWsPort) => {
  const nodeObj = NodeObject(ip, serverWsPort, clientWsPort)
  const result  = filterMatching(activeNodes, nodeObj, false)

  if (isNonEmptyArray(result)) {
    // was already registered
    return false
  }

  activeNodes = activeNodes.concat(nodeObj)

  return true
}

/**
 * Attempt to remove a running node from the nodes array.
 * @param {string} ip The ip of the node.
 * @param {Number} serverWsPort The listening WS port for other server nodes.
 * @param {Number} clientWsPort The listening WS port for clients.
 * @returns {bool} true, if node was running and thus removed. false otherwise.
 */
const unregisterNode = (ip, serverWsPort, clientWsPort) => {
  const nodeObj = NodeObject(ip, serverWsPort, clientWsPort)
  const result  = filterMatching(activeNodes, nodeObj, true)

  if (isEmptyArray(result)) {
    return false
  }

  activeNodes = activeNodes.filter(function(element) {
    // NOTE: This callback must NOT be defined as an arrow function
    //       so that the "this" reference points to the other array
    //       passed as an argument to activeNodes.filter!
    return !this.includes(element)
  }, result)

  return true
}

/**
 * Returns a shallow copy of the active running registered node-servers.
 * @returns {Object[]} Array containing all the active nodes.
 */
const getActiveNodes = () => {
  return [ ...activeNodes ]
}

module.exports = {
  registerNode,
  unregisterNode,
  getActiveNodes
}
