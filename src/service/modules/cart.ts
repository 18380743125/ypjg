import yRequest from '..'

// 保存购物车
export function save(carts: any) {
  return yRequest.post({
    url: '/api/cart',
    data: { carts },
  })
}

// 获取购物车
export function getCarts() {
  return yRequest.get({
    url: '/api/cart',
  })
}
