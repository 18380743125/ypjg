/**
 * @description order service
 * @author bright
 */

const OrderModel = require('../model/mysql/OrderModel')
const OrderDetailModel = require('../model/mysql/OrderDetailModel')

class OrderService {
    // 处理订单
    async handleOrder(uname, orders, totalMoney) {
        await OrderModel.create({ order_no: orders[0].order_no, uname, total_money: totalMoney, status: 1 })
        return await OrderDetailModel.bulkCreate(orders)
    }

    // 更改订单状态
    async updateOrderStatus(order_no, status) {
        return OrderModel.update({ status }, { where: { order_no } })
    }
}

module.exports = new OrderService()