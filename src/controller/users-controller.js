/**
 * @description users controller
 * @author bright
 */

const { Result } = require('../constant')
const {
  findAdminByUname,
  updateAdminByUname,
} = require('../service/admin-service')
const {
  register,
  findUserByUname,
  updateUserByUname,
  logoutAccount,
  getUsers,
  initAccount,
  getAccount,
} = require('../service/users-service')
const { generateHash, compare } = require('../utils/bcrypt')
const { generateToken } = require('../utils/token')
const { getRandom } = require('../utils/random')

const {
  existedError,
  loginError,
  updateError,
  logoutAccountError,
  pwdError,
} = require('../constant/error-type')

// 响应头中注入 authorization
async function _setToken(res, uname, tag) {
  let user = null
  if (tag && tag === 1) {
    user = await findAdminByUname(uname)
    user.tag = 1
  } else {
    user = await findUserByUname(uname)
  }
  delete user.pwd
  const token = generateToken(user)
  res.set('authorization', token)
}

class UsersController {
  // 普通用户注册
  async register(req, res, next) {
    const { uname, pwd } = req.body
    const hash = await generateHash(pwd)
    try {
      const u = await findUserByUname(uname)
      // 用户已存在, 注册失败
      if (u !== null) {
        res.send(existedError)
        return
      }
      let user = await register({ uname, hash })
      user = user.toJSON()
      delete user.pwd
      // 初始化账户
      const account_no = getRandom(15)
      await initAccount(user.uname, account_no)
      res.send(new Result(200, 'ok', user))
    } catch (err) {
      console.error(err)
      next(err)
    }
  }

  // 登录
  async login(req, res, next) {
    const { uname, pwd, tag, remember } = req.body
    try {
      let user = null
      if (tag && tag === 1) {
        // 管理员登录
        user = await findAdminByUname(uname)
      } else {
        // 用户登录
        user = await findUserByUname(uname)
      }
      // 用户不存在
      if (user === null) {
        res.send(loginError)
        return
      }
      if (tag === 1) user.tag = 1
      let isMatch = await compare(pwd, user.pwd)
      // 判断管理员是否使用初始密码登录
      if (tag === 1 && user.pwd.length <= 18 && user.pwd === pwd) {
        isMatch = true
      }
      if (!isMatch) {
        res.send(loginError)
      } else {
        // 登录成功, 生成 token
        delete user.pwd
        const token = generateToken(user)
        if (remember) {
          res.cookie('account', JSON.stringify({ uname, pwd }))
        } else {
          res.clearCookie('account')
        }
        res.set('authorization', token)
        res.send(new Result(200, 'ok', user))
      }
    } catch (err) {
      console.error(err)
      next(err)
    }
  }

  // 获取个人信息
  async getUser(req, res) {
    const user = req.user
    let account
    if (user.tag !== 1) {
      account = await getAccount(user.uname)
      user.balance = account.balance
    }
    res.send(new Result(200, 'ok', user))
  }

  // 获取用户列表
  async getUsers(req, res, next) {
    const { uname, currentPage = 1, pageSize = 15 } = req.query
    try {
      const result = await getUsers(uname, currentPage, pageSize)
      res.send(new Result(200, 'ok', result))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 修改用户 / 管理员 信息
  async updateUserOrAdmin(req, res, next) {
    try {
      let result = null
      const { uname, tag } = req.user
      console.log(req.user)
      if (tag && tag === 1) {
        // 管理员修改个人信息
        result = await updateAdminByUname(req.body)
      } else {
        // 用户修改个人信息
        result = await updateUserByUname(req.body)
      }
      if (result[0] === 1) {
        await _setToken(res, uname, tag)
        res.send(new Result(200, 'ok', '更改成功！'))
      } else {
        res.send(updateError)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 修改密码
  async updateUserOrAdminPwd(req, res, next) {
    const { uname, tag } = req.user
    const { pwd, newPwd } = req.body
    try {
      // 获取用户信息
      let user = null
      // 管理员信息
      if (tag && tag === 1) {
        user = await findAdminByUname(uname)
      } else {
        user = await findUserByUname(uname)
      }
      if (!user) {
        return res.send(updateError)
      }
      // 原密码是否正确
      let isMatch = await compare(pwd, user.pwd)
      if (tag === 1 && user.pwd.length <= 18 && user.pwd === pwd) {
        isMatch = true
      }
      if (!isMatch) {
        return res.send(pwdError)
      }
      if (tag === 1) {
        await updateAdminByUname({ uname, pwd: await generateHash(newPwd) })
      } else {
        await updateUserByUname({ uname, pwd: await generateHash(newPwd) })
      }
      res.clearCookie('account')
      res.send(new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 注销登录
  logoutLogin(req, res) {
    // 注销登录前清空 session
    req.session.destroy()
    res.send(new Result(200, 'ok'))
  }

  // 注销账号
  async logoutAccount(req, res, next) {
    try {
      const user = req.user
      const result = await logoutAccount(user.uname)
      if (result[0] === 0) {
        res.send(logoutAccountError)
        return
      }
      res.send(new Result(200, 'ok', '注销账号成功！'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = new UsersController()
