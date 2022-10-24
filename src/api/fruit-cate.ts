import request from './request'

// 查询水果类别
export function getCates(name?: string) {
  return request({
    url: '/api/category',
    params: { name },
  })
}