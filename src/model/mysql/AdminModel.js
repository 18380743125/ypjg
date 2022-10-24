const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')

const Admin = sequelize.define('User', {
  no: {
    type: DataTypes.INTEGER,
    field: 'id',
    primaryKey: true,
    autoIncrement: true
  },
  uname: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    comment: '用户名'
  },
  pwd: {
    type: DataTypes.STRING(64),
    allowNull: false,
    comment: '密码'
  },
  admin_name: {
    type: DataTypes.STRING(20),
    comment: '管理员姓名'
  },
  age: {
    type: DataTypes.TINYINT,
    comment: '年龄'
  },
  gender: {
    type: DataTypes.CHAR(1),
    comment: '性别'
  }
}, {
  tableName: 'yp_admin',
  createdAt: 'createdTime',
  updatedAt: 'updatedTime'
})

module.exports = Admin