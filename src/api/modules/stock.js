const express = require('express')
const router = express.Router()

const { checkToken, checkAdminRights } = require('../../middleware/auth-middleware')
const {
  getStocks,
  putAwayOrUnshelve,
  updateStock,
  bulkUpdateStock,
} = require('../../controller/stock-controller')

// 查询库存
router.get('/', checkToken, checkAdminRights, getStocks)

// 更新库存
router.patch('/', checkToken, checkAdminRights, updateStock)

// 批量更新库存
router.patch('/bulkUpdate', checkToken, checkAdminRights, bulkUpdateStock)

// 水果上下架
router.patch(
  '/putAwayOrUnshelve',
  checkToken,
  checkAdminRights,
  putAwayOrUnshelve
)

module.exports = router
