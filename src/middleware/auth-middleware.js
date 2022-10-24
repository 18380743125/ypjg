/**
 * @description auth middleware
 * @author bright
 */

const { verifyToken } = require('../utils/token')
const {
  jsonWebTokenError,
  tokenExpiredError,
  captchaError,
  noAdminRights,
} = require('../constant/error-type')

class AuthMiddleware {
  // 检查 token
  async checkToken(req, res, next) {
    const { authorization } = req.headers
    if (!authorization) {
      res.send(jsonWebTokenError)
      return
    }
    try {
      const token = authorization.replace('Bearer ', '')
      const user = verifyToken(token)
      // 鉴权成功
      if (user !== null) {
        req.user = user
        next()
      }
    } catch (err) {
      console.log(err)
      if (err.name === 'TokenExpiredError') {
        // token 过期
        res.send(tokenExpiredError)
      } else if (err.name === 'JsonWebTokenError') {
        // token 无效
        res.send(jsonWebTokenError)
      } else {
        next(err)
      }
    }
  }

  // 核查验证码
  async checkCaptcha(req, res, next) {
    const { captcha } = req.body
    // 验证码不存在
    if (!req.session.captcha) {
      res.send(captchaError)
      return
    }
    const { text, date } = req.session.captcha
    // 检查验证码是否过期, 如果过期在会话中删除验证码  及 是否正确
    const diff = Math.floor((Date.now() - date) / 1000)
    if (diff > 60 || text !== captcha) {
      delete req.session.captcha
      req.session.save()
      res.send(captchaError)
      return
    }
    next()
  }

  // 检查是否具有管理员权限
  checkAdminRights(req, res, next) {
    const user = req.user
    if (user?.tag && user.tag === 1) {
      next()
      return
    }
    res.send(noAdminRights)
  }
}

module.exports = new AuthMiddleware()
