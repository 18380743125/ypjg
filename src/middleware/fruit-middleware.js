/**
 * @description fruit middleware
 * @author bright
 */

const { check, validationResult } = require('express-validator')
const { paramsError } = require('../constant/error-type')
const { findById } = require('../service/category-service')

class FruitMiddleware {
  // 新增水果参数校验
  paramsValidate() {
    return [
      check('name')
        .notEmpty()
        .withMessage('水果名称不能为空！')
        .isLength({ max: 15 })
        .withMessage('水果名称不能超过15个字符！'),
      check('category')
        .notEmpty()
        .withMessage('水果类别id不能为空！')
        .isInt()
        .withMessage('水果类别参数错误！'),
      check('category').custom(async (value) => {
        const c = await findById(value)
        if (c == null) {
          return Promise.reject('类别不存在！')
        }
      }),
      check('weight')
        .notEmpty()
        .withMessage('重量不能为空！')
        .isDecimal()
        .withMessage('重量参数错误！'),
      check('price')
        .notEmpty()
        .withMessage('价格不能为空！')
        .isDecimal()
        .withMessage('价格参数错误！'),
      check('address')
        .notEmpty()
        .withMessage('产地不能为空！')
        .isLength({ max: 50 })
        .withMessage('产地参数错误！'),
      (req, res, next) => {
        const err = validationResult(req)
        if (!err.isEmpty()) {
          res.status(200).send(paramsError)
          return
        }
        next()
      },
    ]
  }

  // 更新参数校验
  checkUpdateParams() {
    return [
      check('fruit_no')
        .notEmpty()
        .withMessage('水果编号不能为空！')
        .isLength({ max: 20 })
        .withMessage('水果编号不能超过20个字符！'),
      check('name')
        .isLength({ max: 15 })
        .withMessage('水果名称不能超过15个字符！'),
      check('category').custom(async (value) => {
        if (!value) return
        if (typeof parseInt(value) !== 'number') {
          return Promise.reject('水果类别参数错误！')
        }
        const c = await findById(value)
        if (c == null) {
          return Promise.reject('类别不存在！')
        }
      }),
      check('weight').custom(async (value) => {
        if (!value) return
        if (typeof parseInt(value) !== 'number') {
          return Promise.reject('重量参数错误！')
        }
      }),
      check('price').custom(async (value) => {
        if (!value) return
        if (typeof parseInt(value) !== 'number') {
          return Promise.reject('价格参数错误！')
        }
      }),
      check('address').isLength({ max: 50 }).withMessage('产地参数错误！'),
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
}

module.exports = new FruitMiddleware()
