const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')

const User = sequelize.define('User', {
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
  name: {
    type: DataTypes.STRING(30),
    comment: '姓名'
  },
  phone: {
    type: DataTypes.STRING(11),
    comment: '手机号'
  },
  address: {
    type: DataTypes.STRING(255),
    comment: '收货地址'
  },
  age: {
    type: DataTypes.TINYINT,
    comment: '年龄'
  },
  gender: {
    type: DataTypes.CHAR(1),
    comment: '性别'
  },
  state: {
    type: DataTypes.CHAR(1),
    comment: '账号是否可用'
  },
  logout_account_time: {
    type: DataTypes.DATE,
    comment: '注销账号申请发起时间'
  },
  avatar: {
    type: DataTypes.STRING(50),
    comment: '头像地址'
  }
}, {
  tableName: 'yp_user',
  createdAt: 'createdTime',
  updatedAt: 'updatedTime'
})

module.exports = User