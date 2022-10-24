/**
 * @description fruit service
 * @author bright
 */

const { Op } = require('sequelize')
const sequelize = require('../utils/db/sequelize')
const FruitModel = require('../model/mysql/FruitModel')
const CategoryModel = require('../model/mysql/CategoryModel')
const StockModel = require('../model/mysql/StockModel')

class FruitService {
    // 新增水果
    async addFruit({ category, address, lUrl, cUrl, ...fruit }) {
        return sequelize.transaction(async () => {
            try {
                // 初始化库存
                const result = await FruitModel.create({
                    ...fruit,
                    category_id: category,
                    original_price: fruit.price,
                    product_address: address,
                    url: lUrl,
                    carousel_url: cUrl,
                }, { raw: true })
                await StockModel.create({ fruit_no: fruit.fruit_no, sales_quantity: 0, stock: 0 })
                return result
            } catch (err) {
                console.log(err)
            }
        })
    }

    // 查询水果
    async findFruits(name, currentPage, pageSize, category) {
        pageSize = parseInt(pageSize)
        category = parseInt(category)
        const where = {}
        name && Object.assign(where, { name: { [Op.substring]: name } })
        category && Object.assign(where, { category_id: category })
        return FruitModel.findAndCountAll({
            attributes: {
                exclude: ['id', 'fruit_category_id']
            },
            include: {
                as: 'cFruit',
                model: CategoryModel,
                attributes: ['name']
            },
            where,
            offset: (currentPage - 1) * pageSize,
            limit: pageSize
        })
    }

    // 根据水果编号查询
    async findByFruitNo(fruit_no) {
        if(!fruit_no) {
            return
        }
        return FruitModel.findOne({ where: { fruit_no }, raw: true })
    }

    // 根据水果编号删除水果
    async delFruitByFruitNo(fruit_no) {
        try {
            sequelize.transaction(async () => {
                await StockModel.destroy({ where: { fruit_no } })
                return FruitModel.destroy({ where: { fruit_no } })
            })
        } catch (err) {
            console.log(err)
        }
    }

    // 更改水果信息
    async updateFruit({ fruit_no, name, category, weight, price, address, lUrl, cUrl }) {
        const obj = {}
        name && Object.assign(obj, { name })
        category && Object.assign(obj, { category_id: category })
        weight && Object.assign(obj, { weight })
        price && Object.assign(obj, { price, original_price: price})
        address && Object.assign(obj, { product_address: address })
        lUrl && Object.assign(obj, { url: lUrl })
        cUrl && Object.assign(obj, { carousel_url: cUrl })
        return FruitModel.update(obj, {where: { fruit_no }})
    }
}

module.exports = new FruitService()