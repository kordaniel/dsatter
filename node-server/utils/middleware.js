const logger = require('./logger')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Token: ', req.token)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

module.exports = {
  unknownEndpoint,
  requestLogger
}
