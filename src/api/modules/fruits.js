const express = require('express')
const mime = require('mime')
const multer = require('multer')

const {
  checkToken,
  checkAdminRights,
} = require('../../middleware/auth-middleware')
const {
  paramsValidate,
  checkUpdateParams,
} = require('../../middleware/fruit-middleware')
const {
  addFruit,
  findFruits,
  delFruit,
  updateFruit,
} = require('../../controller/fruit-controller')
const { configPath } = require('../../utils/multer')

const router = express.Router()

// 配置文件上传的路径及对后缀进行限制
const storage = configPath('fruits')
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 6,
  },
  fileFilter: function (req, file, cb) {
    const suffix = mime.getExtension(file.mimetype)
    if (suffix !== 'png' && suffix !== 'jpg') {
      cb(new multer.MulterError('IMAGE_FORMAT_ERROR', file.fieldname), false)
      return
    }
    cb(null, true)
  },
})

// 新增水果
const fruitUpload = upload.fields([
  { name: 'url', maxCount: 1 },
  { name: 'carouselUrl', maxCount: 3 },
])
router.post(
  '/',
  checkToken,
  checkAdminRights,
  fruitUpload,
  paramsValidate(),
  addFruit
)

// 查询水果列表
router.get('/', checkToken, findFruits)

// 编辑水果
router.patch(
  '/',
  checkToken,
  checkAdminRights,
  fruitUpload,
  checkUpdateParams(),
  updateFruit
)

// 删除水果
router.delete('/', checkToken, checkAdminRights, delFruit)

module.exports = router
