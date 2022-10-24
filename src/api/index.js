/**
 * @description 自动加载 api
 * @author bright
 */

const fs = require('fs')
const path = require('path')
const express = require('express')

const router = express.Router()

const dir = path.join(__dirname, './modules')

for (let fname of fs.readdirSync(dir)) {
  if (fname.indexOf('index.js') !== -1) continue
  const fp = path.join(dir, fname)
  const prefix = `/${fname.replace(/\.\w{1,}$/, '')}`
  router.use(prefix, require(fp))
}

module.exports = router
