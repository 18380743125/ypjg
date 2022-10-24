const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')
const User = require('./UserModel')

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    uname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '用户名'
    },
    account_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '账号'
    },
    balance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: '余额'
    }
}, {
    tableName: 'yp_account',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

User.hasOne(Account, { foreignKey: 'uname', sourceKey: 'uname' })
Account.belongsTo(User, { foreignKey: 'uname', targetKey: 'uname' })

module.exports = Account