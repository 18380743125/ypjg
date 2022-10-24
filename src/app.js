const path = require('path')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const multer = require('multer')
const createError = require('http-errors')

const api = require('./api')
const timedTask = require('./cron')
const { SESSION_SIGN } = require('./constant')
const { ErrorResult, serverError, notFound } = require('./constant/error-type')

const app = express()

// 定时任务
timedTask()

// 模板引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

// cors
app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'content-type')
  res.header(
    'Access-Control-Allow-Methods',
    'DELETE, PUT, PATCH, POST, GET, OPTIONS'
  )
  if (req.method.toLowerCase() === 'options') {
    res.status(200).send()
  } else {
    next()
  }
})

// sesson
app.use(
  session({
    name: 'ypjg_session',
    secret: SESSION_SIGN, // 服务器生成 session 的签名
    cookie: {
      maxAge: 1000 * 60 * 60, // 过期时间 1 小时
      secure: false, // 为 true 时表示只有 https 协议才能访问 cookie
    },
    rolling: true, // 默认为 true 超时前刷新 cookie 会重新计时, false 超时前刷新多少次都是按照第一次刷新开始计时
    resave: true, // 重新设置 session 后, 会自动重新计算过期时间
    saveUninitialized: true, // 强制将为初始化的 session 存储
  })
)

// api
app.use('/api', api)

// 404
app.use((req, res, next) => {
  next(createError(404))
})

// 处理 404 和 统一捕获异常
app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    handleUploadError(err)
    return
  }
  const status = err.status || 500
  res.status(status).send(status === 404 ? notFound : serverError)
})

// 处理文件上传错误
function handleUploadError(err) {
  const code = err.code
  let msg = '文件上传失败! '
  if (code === 'LIMIT_FILE_SIZE') {
    msg = '文件大小不能超过2MB! '
  } else if (code === 'IMAGE_FORMAT_ERROR') {
    msg = '文件格式错误! '
  }
  res.send(new ErrorResult(400, 'updateError', msg))
}

module.exports = app
