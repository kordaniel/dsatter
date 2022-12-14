/* eslint-disable no-console */

let nodeId = 1

const getNodeId = () => {
  return nodeId === -1 ? undefined : nodeId
}

console.log('Mock nodeState created')

module.exports = {
  getNodeId
}
