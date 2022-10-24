const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')

const OrderDetail = sequelize.define('OrderDetail', {
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
    fruit_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        comment: '水果编号'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '数量'
    },
    pay_money: {
        type: DataTypes.DECIMAL(8, 2),
        comment: '支付金额'
    },
    discount_money: {
        type: DataTypes.DECIMAL(8, 2),
        comment: '优惠的金额'
    }
}, {
    tableName: 'yp_order_detail',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

module.exports = OrderDetail