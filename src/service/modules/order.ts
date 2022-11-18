import yRequest from '..'

// 下单
export function handleOrder(goods: any, money: string) {
  return yRequest.post({
    url: '/api/order',
    data: {
      orders: goods,
      money,
    },
  })
}

// 查询支付结果
export function queryPayResult(out_trade_no: string) {
  return yRequest.get({
    url: '/api/order/queryPayResult',
    params: { out_trade_no },
  })
}
