/**
 * @description stock service
 * @author bright
 */

const StockModel = require('../model/mysql/StockModel')
const FruitModel = require('../model/mysql/FruitModel')
const CategoryModel = require('../model/mysql/CategoryModel')

class StockService {
    // 根据水果编号查询库存
    async getStockByFruitNo(fruit_no) {
        return StockModel.findOne({ where: { fruit_no } })
    }

    // 获取库存列表
    async getStocks(name, category, currentPage, pageSize) {
        currentPage = parseInt(currentPage)
        pageSize = parseInt(pageSize)
        category = parseInt(category)
        const where = {}
        name && Object.assign(where, { name })
        category && Object.assign(where, { category_id: category })
        return StockModel.findAndCountAll({
            offset: (currentPage - 1) * pageSize,
            limit: pageSize,
            include: {
                attributes: ['name', 'category_id', 'state', 'url', 'weight'],
                model: FruitModel,
                as: 'fruit',
                where,
                include: [
                    {
                        model: CategoryModel,
                        as: 'cFruit',
                        attributes: ['name']
                    }
                ]
            }
        })
    }

    // 上下架
    async putAwayOrUnshelve(fruit_no, state) {
        return FruitModel.update({ state }, { where: { fruit_no } })
    }

    // 更改库存
    async updateStock(fruit_no, stockNum) {
        return StockModel.increment({ stock: stockNum }, { where: { fruit_no } })
    }
}

module.exports = new StockService()