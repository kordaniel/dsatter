const logger = require('../../common/utils/logger')

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case 'SyntaxError':
      //if (error.type === 'entity.parse.failed') {
      //  // Error happened in Express JSON parser
      //} // But we ignore this for now..
      return res.status(400).json({
        'error': 'Invalid syntax in body JSON'
      })
    default:
      logger.error(error.message)
      next(error)
  }
}

module.exports = {
  unknownEndpoint,
  requestLogger,
  errorHandler
}
