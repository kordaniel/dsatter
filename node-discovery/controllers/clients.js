const clientsRouter = require('express').Router()
const nodesRegister = require('../services/nodes')

const {
  getRandomElementFromArr
}                   = require('../../common/utils/helpers')

clientsRouter.get('/', (req, res) => {
  const activeNodes = nodesRegister.getNodes()
  const suggestedEndpoint = getRandomElementFromArr(activeNodes)

  res.json({
    'suggestedEndpoint': suggestedEndpoint ? suggestedEndpoint : false,
    activeNodes
  })
})

module.exports = clientsRouter
