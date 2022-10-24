import request from './request'

interface IFruitFields {
  name: string
  category: number
  weight: number
  price: number
  address: string
  url: File
  carouselUrl: Array<File>
}

// 新增水果
export function addFruit(fields: IFruitFields) {
  const fd = new FormData()
  fd.append('name', fields.name)
  fd.append('category', fields.category.toString())
  fd.append('weight', fields.weight.toString())
  fd.append('price', fields.price.toString())
  fd.append('address', fields.address)
  fd.append('url', fields.url, '1.png')
  for (let c of fields.carouselUrl) {
    fd.append('carouselUrl', c, '2.png')
  }
  return request({
    url: '/api/fruits',
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: fd,
  })
}

interface IQueryParams {
  name: string
  currentPage: number
  pageSize: number
  category?: number
}
// 查询水果
export function getFruits(params: IQueryParams) {
  return request({
    url: '/api/fruits',
    params,
  })
}

// 删除水果
export function delFruit(fruit_no: string) {
  return request({
    url: '/api/fruits',
    method: 'DELETE',
    data: { fruit_no },
  })
}

type UpdateParams = {
  fruit_no: string,
  name?: string
  category?: number
  weight?: number
  price?: number
  address?: string
  url?: File
  carouselUrl?: Array<File>
  removeUrl: Array<string>
}
// 更新水果
export function updateFruit(fields: UpdateParams) {
  const fd = new FormData()
  fields.fruit_no && fd.append('fruit_no', fields.fruit_no)
  fields.name && fd.append('name', fields.name)
  fields.category && fd.append('category', fields.category.toString())
  fields.weight && fd.append('weight', fields.weight.toString())
  fields.price && fd.append('price', fields.price.toString())
  fields.address && fd.append('address', fields.address)
  fields.url && fd.append('url', fields.url, '1.png')
  if(fields.carouselUrl) {
    for (let c of fields.carouselUrl) {
      fd.append('carouselUrl', c, '2.png')
    }
  }
  fields.removeUrl && fd.append('removeUrl', fields.removeUrl.join(';'))
  return request({
    url: '/api/fruits',
    method: 'PATCH',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: fd
  })
}
