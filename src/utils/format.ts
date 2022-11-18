import pca from '@/assets/data/pca.json'

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
