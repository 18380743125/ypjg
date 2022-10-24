/**
 * @description fruit controller
 * @author bright
 */

const path = require('path')
const { Result } = require('../constant')
const {
  paramsError,
  uploadError,
  delError,
  updateError,
} = require('../constant/error-type')
const {
  addFruit,
  findFruits,
  findByFruitNo,
  delFruitByFruitNo,
  updateFruit,
} = require('../service/fruit-service')
const { delFile } = require('../utils/fs-util')
const { getRandom } = require('../utils/random')

// 当后续逻辑失败时, 删除掉已上传的文件
const delFileWhenFail = async (files) => {
  for (let fileField in files) {
    for (let f of files[fileField]) await delFile(f.path)
  }
}

class FruitController {
  // 新增水果
  async addFruit(req, res, next) {
    const files = req.files
    try {
      // 必传两个文件字段
      if (!files.carouselUrl || !files.url) {
        await delFileWhenFail(files)
        res.send(uploadError)
        return
      }
      // 生成水果编号
      const fruit_no = getRandom(15)
      // 处理文件路径
      const { url, carouselUrl } = files
      const prefix = '/fruits/'
      let lUrl = prefix + url[0].filename
      let cUrl = ''
      for (let fn of carouselUrl) cUrl += prefix + fn.filename + ';'
      await addFruit({ ...req.body, fruit_no, lUrl, cUrl })
      res.send(new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      await delFileWhenFail(files)
      next(err)
    }
  }

  // 查询水果
  async findFruits(req, res, next) {
    const { name, currentPage = 1, pageSize = 15, category } = req.query
    try {
      const result = await findFruits(name, currentPage, pageSize, category)
      result.rows = result.rows.map((item) => {
        item.carousel_url &&
          (item.carousel_url = item.carousel_url.split(';').filter(Boolean))
        return item
      })
      res.send(new Result(200, 'ok', result))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 删除水果
  async delFruit(req, res, next) {
    const { fruit_no } = req.body
    if (!fruit_no) {
      res.send(paramsError)
      return
    }
    try {
      const fruit = await findByFruitNo(fruit_no)
      // 该水果不存在或正在货架上, 无法删除
      if (!fruit || fruit.state === '1') {
        res.send(delError)
        return
      }
      // 删除图片文件
      const dir = path.join(__dirname, '../public', 'uploads')
      await delFile(dir + fruit.url)
      if (fruit.carousel_url !== null) {
        const curls = fruit.carousel_url.split(';').filter(Boolean)
        for await (let c of curls) await delFile(dir + c)
      }
      // 删除数据库中记录
      await delFruitByFruitNo(fruit_no)
      res.send(new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 编辑水果
  async updateFruit(req, res, next) {
    const files = req.files
    const { fruit_no, name, category, weight, price, address, removeUrl } =
      req.body
    try {
      const fruit = await findByFruitNo(fruit_no)
      if (!fruit) {
        return res.send(updateError)
      }
      // 处理文件路径
      const { url, carouselUrl } = files
      const prefix = '/fruits/'
      let lUrl = ''
      if (url) {
        lUrl = prefix + url[0].filename
      }
      let cUrl = ''
      // 将要删除的图片
      const removeFps = removeUrl
        .split(';')
        .filter(Boolean)
        .map((item) => item.replace('/uploads', ''))
      // 之前的轮播图地址
      const preCFps = fruit.carousel_url.split(';').filter(Boolean)
      // carouselUrl 新加的轮播图
      if (carouselUrl) {
        for (let fn of carouselUrl) cUrl += prefix + fn.filename + ';'
        for (let fp of preCFps) {
          if (removeFps.indexOf(fp) === -1) {
            cUrl += fp + ';'
          }
        }
      }
      // 未新加轮播图, 删除了一些
      if (cUrl === '') {
        for (let fp of preCFps) {
          if (removeFps.indexOf(fp) === -1) cUrl += fp + ';'
        }
      }
      const result = await updateFruit({
        fruit_no,
        name,
        category,
        weight,
        price,
        address,
        lUrl,
        cUrl,
      })
      if (removeFps.length > 0) {
        for (let fp of removeFps)
          await delFile(path.join(__dirname, '../public/uploads', fp))
      }
      if (result[0] === 0) {
        return res.send(updateError)
      }
      res.send(new Result(200, 'ok'))
    } catch (err) {
      await delFile(files)
      console.log(err)
      next()
    }
  }
}

module.exports = new FruitController()
