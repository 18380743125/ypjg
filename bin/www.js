const http = require('http')
const debug = require('debug')('ypjg-api:server')

require('../src/utils/db/sequelize')
require('../src/utils/db/mongoose')

const app = require('../src/app')
const { PORT } = require('../src/config/config.default')


// 设置端口号
const port = normalizePort(PORT || '9090')
app.set('port', port)

// 创建服务器
const server = http.createServer(app)

// 监听端口号
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

// 格式化自定义端口号
function normalizePort(val) {
  const port = parseInt(val, 10)
  if (isNaN(port)) {
    return val
  }
  if (port >= 0) {
    return port
  }
  return false
}

// 监听 error 事件
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
    default:
      throw error
  }
}

// 监听 listening 事件
function onListening() {
  const address = server.address()
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port
  debug('Listening on ' + bind)
}
