/**
 * @typedef {import(../../common/types/datatypes).RegisteredNode} RegisteredNode
 * @typedef {import(../../common/types/datatypes).ActiveNode} ActiveNode
 */

/**@type {RegisteredNode[]}} */
const nodes = [
  {
    id: 112,
    password: 'password1'
  },
  {
    id: 241,
    password: 'password2'
  },
  {
    id: 56,
    password: 'password3'
  }
]


/**@type {ActiveNode[]} */
const activeNodes = [
  {
    id: 112,
    syncport: 10001,
    clientport: 12001,
    address: 'address1'
  },
  {
    id: 56,
    syncport: 10002,
    clientport: 12002,
    address: 'address2'
  }
]

module.exports = { nodes, activeNodes }
