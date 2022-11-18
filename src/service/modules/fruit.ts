import yRequest from '..'

interface IQueryParams {
  name?: string
  category?: number
  currentPage: number
  pageSize: number
}

// 查询水果
export function getFruits(params: IQueryParams) {
  return yRequest.get({
    url: '/api/fruits',
    params,
  })
}
