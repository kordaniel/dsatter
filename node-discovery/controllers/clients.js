const clientsRouter = require('express').Router()
const dbService     = require('../database/database-service')

const {
  shuffleArray
}                   = require('../../common/utils/helpers')

/**
 * Replies with a list containing all the known active nodes with their adress&client port.
 */
clientsRouter.get('/', async (req, res) => {
  const activeNodes = await dbService.getAllActiveNodes()

  const responseNodes = activeNodes.map(n => {
    return {
      address: n.address, clientport: n.clientport
    }
  })

  // TODO: Sort the list based on... "some meaningful criteria, load, distance whatever"
  shuffleArray(responseNodes)

  res.json({ 'activeNodes': responseNodes })
})

module.exports = clientsRouter
