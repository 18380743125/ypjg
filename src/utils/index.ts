import * as XLSX from 'xlsx'
import type { RcFile } from 'antd/es/upload/interface'
import pca from '@/assets/data/pca.json'

// 根据 key 获取 value
export function getItem(key: string) {
  if (localStorage.getItem(key) === 'undefined') removeItem(key)
  let result = localStorage.getItem(key) // 根据key查找
  if (result) result = JSON.parse(result)
  return result
}
// 将数据存入本地存储中
export function setItem(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}
// 删除指定 key
export function removeItem(key: string) {
  localStorage.removeItem(key)
}

// 格式化省市区数据
function _formatPca(pca: any) {
  const res = []
  // 遍历省份
  for (let p in pca) {
    const po: any = {}
    po.value = p
    po.label = p
    const p_children = []
    // 遍历市
    for (let c in pca[p]) {
      const co: any = {}
      co.value = c
      co.label = c
      const c_children = []
      // 遍历区
      for (let a of pca[p][c]) {
        const ao: any = {}
        ao.value = a
        ao.label = a
        c_children.push(ao)
      }
      co.children = c_children
      p_children.push(co)
    }
    po.children = p_children
    res.push(po)
  }
  return res
}
export const pcaOptions = _formatPca(pca)

// 将 blob 转 base64
export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

// 检查图片格式
export const checkImageFormat = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2
  return { isJpgOrPng, isLt2M }
}

// 生成 excel 工作表
export const createWs = (
  data: Array<Record<string, any>>,
  fields: Array<string>,
  titles: Record<string, any>
) => {
  const ws = XLSX.utils.json_to_sheet(data, { header: fields })
  const range = XLSX.utils.decode_range(ws['!ref'] as string)
  for(let c = range.s.c; c <= range.e.c; c++) {
    // 获取第 c + 1 列的头部
    const header = XLSX.utils.encode_col(c) + 1
    ws[header].v = titles[ws[header].v]
  }
  return ws
}
