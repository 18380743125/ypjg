/**
 * @description 生成和检验 token
 * @author bright
 */

const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')

function generateToken(obj) {
  const privateKey = fs.readFileSync(
    path.join(__dirname, '../constant/keys/rsa_private_key.pem')
  )
  const token = jwt.sign(obj, privateKey, {
    algorithm: 'RS256',
    expiresIn: 6 * 60 * 60,
  })
  return token
}

function verifyToken(token) {
  const publicKey = fs.readFileSync(
    path.join(__dirname, '../constant/keys/rsa_public_key.pem')
  )
  const result = jwt.verify(token, publicKey)
  return result
}

module.exports = {
  generateToken,
  verifyToken,
}
