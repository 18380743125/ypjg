import request from './request'

// 查询水果类别
export function findCates(name?: string) {
  return request({
    url: '/api/category',
    params: { name },
  })
}

// 新增水果类别
export function addCate(name: string) {
  return request({
    url: '/api/category',
    method: 'POST',
    data: { name },
  })
}

// 删除类别
export function delCate(id: number) {
  return request({
    url: '/api/category',
    method: 'DELETE',
    data: { id }
  })
}

// 修改类别名称
export function updateCate(id: number, name: string) {
  return request({
    url: '/api/category',
    method: 'PATCH',
    data: { id, name }
  })
}
