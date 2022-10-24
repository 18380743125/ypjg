import request from '@/api/request'

interface IQueryParams {
  name?: string
  category?: number
  currentPage: number
  pageSize: number
}
// 查询水果
export function getFruits(params: IQueryParams) {
  return request({
    url: '/api/fruits',
    params,
  })
}
