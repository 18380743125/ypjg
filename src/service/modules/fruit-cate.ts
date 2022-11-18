import yRequest from '..'

// 查询水果类别
export function getCates(name?: string) {
  return yRequest.get({
    url: '/api/category',
    params: { name },
  })
}
