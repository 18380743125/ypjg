import request from "./request";

// 下单
export function handleOrder(goods: any, money: string) {
  return request({
    url: '/api/order',
    method: 'POST',
    data: {
      orders: goods,
      money
    }
  })
}

// 查询支付结果
export function queryPayResult(out_trade_no: string) {
  return request({
    url: '/api/order/queryPayResult',
    params: { out_trade_no }
  })
}