const nodeDiscRouter = require('express').Router()
const nodesRegister  = require('../services/nodes')

nodeDiscRouter.get('/active', (req, res) => {
  res.json(nodesRegister.getNodes())
})

nodeDiscRouter.post('/active/register', (req, res) => {
  const { port }    = req.body
  const activeNodes = nodesRegister.getNodes()
  const success     = nodesRegister.registerNode(port)

  const responseObj = {
    'wasRegistered': success ? port : false,
    'activeNodes': activeNodes
  }

  res.json(responseObj)
})

nodeDiscRouter.post('/active/unregister', (req, res) => {
  const { port } = req.body
  const success  = nodesRegister.unregisterNode(port)

  const responseObj = {
    'wasUnregistered': success,
    'activeNodes': nodesRegister.getNodes()
  }

  res.json(responseObj)
})

module.exports = nodeDiscRouter
