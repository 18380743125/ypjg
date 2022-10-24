const express = require('express')
const router = express.Router()

const { checkToken } = require('../../middleware/auth-middleware')
const { handleOrder, queryPayResult } = require('../../controller/order-controller')

// 处理下单
router.post('/', checkToken, handleOrder)

// 查询支付结果
router.get('/queryPayResult', checkToken, queryPayResult)

module.exports = router
