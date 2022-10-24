// 生成指定位数的随机数
function getRandom(n) {
  const start = Math.pow(10, n - 1)
  const end = Math.pow(10, n) - 1
  const diff = end - start
  return start + diff * Math.random()
}

module.exports = {
  getRandom
}