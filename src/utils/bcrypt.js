/**
 * @description 加密与校验
 * @author bright
 */

const bcrypt = require('bcryptjs')

// 加密
async function generateHash(pwd) {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hash(pwd.toString(), salt)
  return hash
}

// 校验密码
async function compare(pwd, hash) {
  return bcrypt.compare(pwd.toString(), hash)
}

module.exports = {
  generateHash,
  compare
}
