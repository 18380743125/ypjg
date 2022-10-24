/**
 * @description order Controller
 * @author bright
 */

const axios = require('axios')
const { Result } = require('../constant')
const { getRandom } = require('../utils/random')
const { handleOrder, updateOrderStatus } = require('../service/order-service')
const sequelize = require('../utils/db/sequelize')
// 支付的配置
const alipaySdk = require('../utils/alipay-util')
const AlipayFormData = require('alipay-sdk/lib/form').default

class OrderController {
  async handleOrder(req, res, next) {
    let { orders, money } = req.body
    const { uname } = req.user
    // 生成订单号
    const order_no = getRandom(15)
    // 处理订单数据
    orders = orders.map((item) => {
      return {
        order_no,
        fruit_no: item.fruit_no,
        quantity: item.count,
        pay_money: parseFloat(item.price) * item.count,
      }
    })
    try {
      sequelize.transaction(async () => {
        await handleOrder(uname, orders, money)
        // 对接支付宝
        const formData = new AlipayFormData()
        formData.setMethod('get')
        formData.addField('returnUrl', 'http://localhost:3000/pay-result')
        formData.addField('bizContent', {
          outTradeNo: order_no, // 订单id
          productCode: 'FAST_INSTANT_TRADE_PAY',
          totalAmount: money,
          subject: '益品佳果',
          body: '商品支付',
        })
        const url = await alipaySdk.exec(
          'alipay.trade.page.pay',
          {},
          { formData: formData }
        )
        // 将订单状态改为 待支付：2
        await updateOrderStatus(order_no, 2)
        res.send(new Result(200, 'ok', url))
      })
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  async queryPayResult(req, res, next) {
    let out_trade_no = req.body.out_trade_no
    // 对接支付宝
    const formData = new AlipayFormData()
    formData.setMethod('get')
    formData.addField('bizContent', {
      out_trade_no,
    })

    const result = alipaySdk.exec(
      'alipay.trade.query',
      {},
      { formData: formData }
    )
    result.then((resData) => {
      axios({
        url: resData,
        method: 'get',
      })
        .then((data) => {
          let r = data.data.alipay_trade_query_response
          let resData
          if (r.code === '10000') {
            switch (r.trade_status) {
              case 'TRADE_SUCCESS':
                resData = {
                  success: true,
                  code: 200,
                  result: '交易成功!',
                }
                break
              case 'WAIT_BUYER_PAY':
                resData = {
                  success: true,
                  code: 200,
                  result: '支付宝有交易记录, 未付款!',
                }
                break
              case 'TRADE_FINISH':
                resData = {
                  success: true,
                  code: 200,
                  result: '交易完成, 不能退款!',
                }
                break
              case 'TRADE_CLOSE':
                resData = {
                  success: true,
                  code: 200,
                  result: '交易关闭, 没有支付成功!',
                }
            }
          } else if (r.code === '40004') {
            res.json('交易不存在!')
          }
          res.send(resData)
        })
        .catch((err) => {})
    })
  }
}

module.exports = new OrderController()
