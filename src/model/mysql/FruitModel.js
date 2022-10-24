const { DataTypes } = require('sequelize')
const sequelize = require('../../utils/db/sequelize')
const Category = require('./CategoryModel')

const Fruit = sequelize.define('Fruit', {
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
    name: {
        type: DataTypes.STRING(15),
        allowNull: false,
        comment: '水果名称'
    },
    category_id: {
        type: DataTypes.INTEGER,
        field: 'fruit_category_id',
        allowNull: false,
        comment: '水果类别id'
    },
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
        comment: '重量'
    },
    original_price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        comment: '原价',
    },
    price: {
        type: DataTypes.DECIMAL(6, 2),
        allowNull: false,
        comment: '价格',
    },
    state: {
        type: DataTypes.CHAR(1),
        defaultValue: '0',
        comment: '状态'
    },
    product_address: {
        type: DataTypes.STRING(50),
        allowNull: false,
        comment: '产地'
    },
    tag: {
        type: DataTypes.STRING(15),
        comment: '标签'
    },
    url: {
        type: DataTypes.STRING(50),
        comment: '缩略图'
    },
    carousel_url: {
        type: DataTypes.STRING(255),
        comment: '轮播图'
    }
}, {
    tableName: 'yp_fruit',
    createdAt: 'createdTime',
    updatedAt: 'updatedTime'
})

Fruit.belongsTo(Category, { targetKey: 'id', foreignKey: 'fruit_category_id', as: 'cFruit' })
Category.hasMany(Fruit, { sourceKey: 'id', foreignKey: 'fruit_category_id', as: 'cFruit' })

module.exports = Fruit