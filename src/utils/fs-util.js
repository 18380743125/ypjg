/**
 * @description 操作文件的工具
 * @author bright
 */

const fs = require('fs')

// 删除文件
function delFile(fp) {
  if (!fp || !fs.existsSync(fp)) return
  return new Promise((resolve, reject) => {
    fs.unlink(fp, (err) => {
      if (err) reject('DEL_ERROR')
      else resolve('OK')
    })
  })
}

module.exports = {
  delFile,
}
