const express = require('express')
const router = express.Router()

const { checkToken } = require('../../middleware/auth-middleware')
const { save, getCart } = require('../../controller/cart-controller')

// 保存购物车
router.post('/', checkToken, save)

// 查询购物车
router.get('/', checkToken, getCart)

module.exports = router
