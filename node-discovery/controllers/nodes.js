const nodeDiscRouter = require('express').Router()
const nodesRegister  = require('../services/nodes')


nodeDiscRouter.get('/active', (req, res) => {
  res.json({ 'activeNodes': nodesRegister.getActiveNodes() })
})

nodeDiscRouter.post('/active/register', (req, res) => {
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

nodeDiscRouter.post('/active/unregister', (req, res) => {
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
