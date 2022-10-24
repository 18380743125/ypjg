/**
 * @description 连接 mongodb
 * @author bright
 */

const mongoose = require('mongoose')

const dbName = 'ypjg' // 数据库名称
const user = 'bright' // 用户名
const pass = 'AI123456' // 密码

mongoose.connect(`mongodb://localhost:27017/${dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  user,
  pass,
})

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error.'))

db.once('open', function () {
  console.log('Mongodb  Connection has been established successfully.')
})
