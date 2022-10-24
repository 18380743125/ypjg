const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')
const Fruit = require('./FruitModel')

const Stock = sequelize.define('Stock', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    fruit_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '水果编号'
    },
    sales_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: '销售份数'
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: '现有库存'
    }
}, {
    tableName: 'yp_stock',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

// 一对一关系
Stock.belongsTo(Fruit, { targetKey: 'fruit_no', foreignKey: 'fruit_no', as: 'fruit' })
Fruit.hasOne(Stock, { sourceKey: 'fruit_no', foreignKey: 'fruit_no', as: 'fruit' })


module.exports = Stock
