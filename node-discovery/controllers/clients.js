const clientsRouter = require('express').Router()
const nodesRegister = require('../services/nodes')

const {
  shuffleArray
}                   = require('../../common/utils/helpers')

/**
 * Replies with a list containing all the known active nodes with their adress&client port.
 */
clientsRouter.get('/', (req, res) => {
  const activeNodes = nodesRegister.getActiveNodes().map(n => {
    return {
      address: n.address, portClient: n.portClient
    }
  })

  // TODO: Sort the list based on... "some meaningful criteria, load, distance whatever"
  shuffleArray(activeNodes)

  res.json({ 'activeNodes': activeNodes })
})

module.exports = clientsRouter
