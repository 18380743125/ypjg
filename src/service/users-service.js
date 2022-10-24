/**
 * @description users services
 * @author bright
 */


const { Op } = require('sequelize')
const dayjs = require('dayjs')
const UserModel = require('../model/mysql/UserModel')
const AccountModel = require('../model/mysql/AccountModel')
const { LOGOUT_ACCOUNT_DAYS } = require('../constant')

class UserService {
  // 用户注册
  async register({ uname, hash }) {
    return UserModel.create({ uname, pwd: hash, avatar: '/users/default.png' })
  }

  // 根据用户名查找一个用户
  async findUserByUname(uname) {
    return UserModel.findOne({ where: { uname }, raw: true })
  }

  // 获取用户列表, 可根据用户名进行模糊匹配
  async getUsers(uname, currentPage, pageSize) {
    currentPage = parseInt(currentPage)
    pageSize = parseInt(pageSize)
    const where = {}
    uname && Object.assign(where, { uname: { [Op.substring]: uname } })
    return UserModel.findAndCountAll({
      attributes: { exclude: ['pwd'] },
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
      where,
      raw: true
    })
  }

  // 根据用户名修改个人信息
  async updateUserByUname({ uname, pwd, nickname, age, gender, phone, address }) {
    const user = {}
    pwd && Object.assign(user, { pwd })
    nickname && Object.assign(user, { nickname })
    gender && Object.assign(user, { gender })
    phone && Object.assign(user, { phone })
    address && Object.assign(user, { address })
    if(age >= 0) Object.assign(user, { age })
    return UserModel.update(user, { where: { uname } })
  }

  // 注销账号
  async logoutAccount(uname) {
    const user = { state: 0, logout_account_time: new Date() }
    return UserModel.update(user, { where: { uname } })
  }

  // 删除用户
  async delUsers() {
    const date = dayjs().subtract(LOGOUT_ACCOUNT_DAYS, 'day')
    return UserModel.destroy({
      where: {
        state: 0,
        logout_account_time: {
          [Op.not]: null,
          [Op.lte]: new Date(date)
        }
      }
    })
  }

  // 初始化账户
  async initAccount(uname, account_no) {
    return AccountModel.create({ uname, account_no, balance: 0 })
  }

  // 根据用户名获取账号信息
  async getAccount(uname) {
    return AccountModel.findOne({ where: { uname } })
  }

}

module.exports = new UserService()
