/**
 * @description admin service
 * @author bright
 */

const AdminModel = require('../model/mysql/AdminModel')

class AdminService {
  // 根据用户名查找管理员
  async findAdminByUname(uname) {
    return AdminModel.findOne({ where: {uname}, raw: true })
  }

  // 根据用户名修改个人信息
  async updateAdminByUname({ uname, pwd, admin_name, age, gender }) {
    const admin = {}
    pwd && Object.assign(admin, { pwd })
    admin_name && Object.assign(admin, { admin_name })
    gender && Object.assign(admin, { gender })
    if(age >= 0) Object.assign(admin, { age })
    return AdminModel.update(admin, { where: { uname } })
  }
}

module.exports = new AdminService()