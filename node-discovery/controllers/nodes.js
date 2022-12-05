const nodeDiscRouter = require('express').Router()
const nodesRegister  = require('../services/nodes')

// -----------------------------------------
// TODO: Remove and use database connection
function* idGenerator() {
  let i = 0
  while (true) {
    i += 1
    yield i
  }
}
const nextId = idGenerator()
// -----------------------------------------

nodeDiscRouter.post('/register', (req, res) => {
  // TODO: Query DB (?) and return the next free id. No checks needed
  res.json({ id: nextId.next().value })
})

nodeDiscRouter.get('/active', (req, res) => {
  res.json({ 'activeNodes': nodesRegister.getActiveNodes() })
})


nodeDiscRouter.post('/active/login', (req, res) => {
  const serverNodeIp = req.ip
  const {
    serverPort,
    clientPort
  }                  = req.body

  const activeNodes  = nodesRegister.getActiveNodes()
  const success      = nodesRegister.registerNode(serverNodeIp, serverPort, clientPort)

  const responseObj = {
    'address':     success ? serverNodeIp : false,
    'serverPort':  success ? serverPort : false,
    'clientPort':  success ? clientPort : false,
    'activeNodes': activeNodes
  }

  res.json(responseObj)
})

nodeDiscRouter.post('/active/logout', (req, res) => {
  const serverNodeIp = req.ip
  const {
    serverPort,
    clientPort
  }                  = req.body

  const success      = nodesRegister.unregisterNode(serverNodeIp, serverPort, clientPort)

  const responseObj = {
    'wasUnregistered': success,
    'activeNodes': nodesRegister.getActiveNodes()
  }

  res.json(responseObj)
})

module.exports = nodeDiscRouter
