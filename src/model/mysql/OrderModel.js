const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')
const OrderDetail = require('./OrderDetailModel')

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '订单号'
    },
    uname: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '用户名'
    },
    total_money: {
        type: DataTypes.DECIMAL(8, 2),
        comment: '订单总金额'
    },
    phone: {
        type: DataTypes.STRING(11),
        comment: '手机号'
    },
    status: {
        type: DataTypes.CHAR(1),
        comment: '订单状态'
    }
}, {
    tableName: 'yp_order',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

// 建立关联
Order.hasMany(OrderDetail, { foreignKey: 'order_no', sourceKey: 'order_no' })
OrderDetail.belongsTo(Order, { foreignKey: 'order_no', targetKey: 'order_no' })

module.exports = Order