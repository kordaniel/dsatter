const config = require('./utils/config')
const logger = require('./utils/logger')

const express    = require('express')
const app        = express()
const front_port = 10101

app.get('/hello', (req, res) => {
  res.send(`${config.CONFIG_TEST_MSG}\n`)
})

app.listen(front_port, () => {
  logger.info(`DSatter server started, listening to port ${front_port}`)
})



//const wss = require('./ws/server')


const { WebSocketServer } = require('ws')

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', function connection(ws, req) {
  logger.info(`Connected to ${req.socket.remoteAddress}:${req.socket.remotePort}`)

  ws.on('message', function message(data) {
    logger.info(`-> ${req.socket.remoteAddress}:${req.socket.remotePort}: %s`, data)
    //console.log('received: %s', data, 'from ip: ', req.socket.remoteAddress, ':', req.socket.remotePort)
    ws.send('acknowledge')
  })

  ws.send('something')
})

wss.on('close', function close() {
  logger.info('disconnected')
})


/*
if (!config.parseArgs(process.argv)) {
  logger.error('Bad arguments')
  logger.error('Usage: NODE_ENV=<production|development|test> node index.js --listen=<port> --connect=<port>')
  logger.error('Exiting..')
  process.exit(64) // sysexits.h EX_USAGE
}

logger.info('chatserver node starting')
logger.info('------------------------')
logger.info(`listening for websocket connections on port: ${config.getPort('listen')}`)
logger.info(`attempting to connect to other node on port: ${config.getPort('connect')}`)
logger.info('------------------------')
*/

logger.info(config.CONFIG_TEST_MSG)
