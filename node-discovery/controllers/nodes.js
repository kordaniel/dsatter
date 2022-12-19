const nodeDiscRouter = require('express').Router()

const logger         = require('../../common/utils/logger')
const dbService      = require('../database/database-service')

nodeDiscRouter.post('/register', async (req, res) => {
  // NOTE: Password is intentionally saved as plaintext into the DB
  const { password } = req.body

  if (!password) {
    return res.status(400).json({
      error: 'password required'
    })
  }
  if (typeof password !== 'string') {
    return res.status(400).json({
      error: 'password is not a string'
    })
  }

  const newNode = await dbService.addNodeToDatabase({ password })

  if (!newNode) {
    return res.status(500).send()
  }

  res.json(newNode)
})

nodeDiscRouter.get('/active', async (req, res) => {
  const activeNodes = await dbService.getAllActiveNodes()
  res.json({ activeNodes })
})

nodeDiscRouter.post('/active/login', async (req, res) => {
  const address = req.ip
  const {
    id,
    password,
    syncport,
    clientport
  }                  = req.body

  logger.debug('LOGIN:', id, password, syncport, clientport)

  if (!(id && password && syncport && clientport)) {
    return res.status(400).json({
      error: 'id, password, syncport, clientport expected'
    })
  }

  const nodeObjWithId = await dbService.searchNodeDatabase(id)

  if (!nodeObjWithId || nodeObjWithId.password !== password) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  // NOTE: Simply remove the previous row with same ID from DB...
  const activeNodeObj = await dbService.searchActiveNodeDatabase(id)
  if (activeNodeObj) {
    await dbService.removeActiveNodeFromDatabase(activeNodeObj.id)
  }

  const otherActiveNodes = await dbService.getAllActiveNodes()

  await dbService.addActiveNodeToDatabase({
    id,
    syncport,
    clientport,
    address
  })


  const responseObj = {
    ...(await dbService.searchActiveNodeDatabase(id)), // id, syncport, clientport, address
    activeNodes: otherActiveNodes
  }

  res.json(responseObj)
})

nodeDiscRouter.post('/active/logout', async (req, res) => {
  const {
    id,
    password
  } = req.body

  if (!id || !password) {
    return res.status(400).json({
      error: 'id or password missing'
    })
  }
  if (typeof password !== 'string') {
    return res.status(400).json({
      error: 'password is not a string'
    })
  }

  const nodeObjWithId = await dbService.searchNodeDatabase(id)

  if (!nodeObjWithId || nodeObjWithId.password !== password) {
    return res.status(401).json({ error: 'invalid credentials' })
  }

  await dbService.removeActiveNodeFromDatabase(id)

  const responseObj = {
    'activeNodes': await dbService.getAllActiveNodes()
  }

  res.json(responseObj)
})

module.exports = nodeDiscRouter
