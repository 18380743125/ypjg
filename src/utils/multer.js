/**
 * @description 配置文件上传路径
 * @author bright
 */

const fs = require('fs')
const path = require('path')
const multer = require('multer')
const mime = require('mime')
const { v4: uuidV4 } = require('uuid')

function configPath(dir) {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dpath = path.join(__dirname, '../../public', 'uploads', dir)
      if (!fs.existsSync(dpath)) {
        fs.mkdirSync(dpath)
      }
      return cb(null, dpath)
    },
    filename: (req, file, cb) => {
      const ext = mime.getExtension(file.mimetype)
      return cb(null, `${uuidV4()}.${ext}`)
    },
  })
  return storage
}

module.exports = {
  configPath,
}
