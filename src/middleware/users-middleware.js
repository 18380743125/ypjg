/**
 * @description users middleware
 * @author bright
 */

const { check, validationResult } = require('express-validator')
const { paramsError } = require('../constant/error-type')

class UsersMiddleware {
  // 参数校验
  paramsValidate() {
    return [
      check('captcha').notEmpty().withMessage('验证码不能为空！'),
      check('uname')
        .notEmpty()
        .withMessage('用户名不能为空！')
        .isLength({ min: 2, max: 20 })
        .withMessage('用户名长度在 2 到 20 个字符之间！'),
      check('pwd')
        .notEmpty()
        .withMessage('密码不能为空！')
        .isLength({ min: 6, max: 18 })
        .withMessage('密码长度在 6 到 18 个字符之间！'),
      (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
          const eo = err.array()[0]
          res.status(200).send(paramsError)
          return
        }
        next()
      },
    ]
  }

  // 修改个人信息参数校验
  unameValidate() {
    return [
      check('uname')
        .notEmpty()
        .withMessage('用户名不能为空！')
        .isLength({ min: 2, max: 20 })
        .withMessage('用户名长度在 2 到 20 个字符之间！'),
      (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
          const eo = err.array()[0]
          res.status(400).send(paramsError)
          return
        }
        next()
      },
    ]
  }
}

module.exports = new UsersMiddleware()
