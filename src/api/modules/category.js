const express = require('express')
const router = express.Router()

const {
  addFruitCate,
  delFruitCate,
  findFruitsCate,
  updateFruitCate,
} = require('../../controller/category-controller')
const {
  checkToken,
  checkAdminRights,
} = require('../../middleware/auth-middleware')

// 新增水果类别
router.post('/', checkToken, checkAdminRights, addFruitCate)

// 删除水果类别
router.delete('/', checkToken, checkAdminRights, delFruitCate)

// 查询水果类别
router.get('/', checkToken, findFruitsCate)

// 更改水果类别
router.patch('/', checkToken, checkAdminRights, updateFruitCate)

module.exports = router
