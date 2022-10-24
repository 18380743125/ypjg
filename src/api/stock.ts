import request from './request'


type QueryParams = {
  currentPage?: number
  pageSize: number
  name?: string
  category?: number
}
// 获取库存信息
export function getStocks(params: QueryParams) {
  return request({
    url: '/api/stock',
    params
  })
}

// 上下架
export function putAwayOrUnshelve(fruit_no: string, state: string) {
  return request({
    url: '/api/stock/putAwayOrUnshelve',
    method: 'PATCH',
    data: { fruit_no, state }
  })
}

// 更新库存
export function updateStock(fruit_no: string, stockNum: any) {
  return request({
    url: '/api/stock',
    method: 'PATCH',
    data: { fruit_no, stockNum }
  })
}

// 批量更新库存
export function bulkUpdateStock(stocks: Array<Record<string, any>>) {
  return request({
    url: '/api/stock/bulkUpdate',
    method: 'PATCH',
    data: { stocks }
  })
}