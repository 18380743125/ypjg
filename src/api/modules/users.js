const express = require('express')
const router = express.Router()
const {
  login,
  register,
  updateUserOrAdmin,
  logoutLogin,
  logoutAccount,
  getUser,
  getUsers,
  updateUserOrAdminPwd,
} = require('../../controller/users-controller')
const {
  paramsValidate,
  unameValidate,
} = require('../../middleware/users-middleware')
const {
  checkToken,
  checkCaptcha,
  checkAdminRights,
} = require('../../middleware/auth-middleware')

// 用户注册
router.post('/', checkCaptcha, register)

// 获取个人信息
router.get('/', checkToken, getUser)

// 获取用户列表
router.get('/getUsers', checkToken, checkAdminRights, getUsers)

// 登录
router.post('/login', paramsValidate(), checkCaptcha, login)

// 修改个人信息
router.patch('/', unameValidate(), checkToken, updateUserOrAdmin)

// 修改密码
router.patch('/updatePwd', checkToken, updateUserOrAdminPwd)

// 注销登录
router.post('/logoutLogin', logoutLogin)

// 注销账号
router.post('/logoutAccount', checkToken, logoutAccount)

module.exports = router
