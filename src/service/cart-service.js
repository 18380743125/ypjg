/**
 * @description cart Service
 * @author bright
 */

const CartModel = require('../model/mongodb/CartModel')

class  CartService {
    // 添加购物车
    async save(fruit, uname) {
        return CartModel.create({ uname, ...fruit })
    }

    // 删除购物车
    async remove(fruit_no, uname) {
        return CartModel.deleteOne({ fruit_no, uname })
    }

    // 更新购物车
    async update(uname, fruit_no, count, checked) {
        return CartModel.updateOne({ fruit_no, uname }, {  count, checked })
    }

    // 查询购物车
    async getCart(uname) {
        return CartModel.find({ uname })
    }
}

module.exports = new CartService()