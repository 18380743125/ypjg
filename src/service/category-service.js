/**
 * @description category service
 * @author bright
 */

const { Op } = require('sequelize')
const CategoryModel = require('../model/mysql/CategoryModel')

class CategoryService {
    // 根据名称查询类别
    async findByName(name) {
        return CategoryModel.findOne({ where: { name }, raw: true })
    }

    // 根据id查询
    async findById(id) {
        return CategoryModel.findByPk(id)
    }

    // 新增类别
    async add(name) {
        return CategoryModel.create({ name })
    }

    // 查询所有类别
    async findAll(name) {
        const where = {}
        if(name) {
            Object.assign(where, { name: { [Op.substring]: name } })
        }
        return CategoryModel.findAll({ where });
    }

    // 根据 id 更改类别名称
    async updateName(id, name) {
        return CategoryModel.update({ name }, { where: { id } })
    }

    // 根据名称删除类别
    async delById(id) {
        return CategoryModel.destroy({ where: { id } })
    }
}

module.exports = new CategoryService()