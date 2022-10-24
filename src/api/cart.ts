import request from './request'

// 保存购物车
export function save(carts: Array<Record<string, any>>) {
  return request({
    url: '/api/cart',
    method: 'POST',
    data: { carts }
  })
}

// 获取购物车数据
export function getCarts() {
  return request({
    url: '/api/cart'
  })
}