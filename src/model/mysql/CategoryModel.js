const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')

const FruitCategory = sequelize.define('FruitCategory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        comment: '水果类别名称'
    }
}, {
    tableName: 'yp_fruit_category',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

module.exports = FruitCategory