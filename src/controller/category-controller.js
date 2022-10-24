/**
 * @description fruit category controller
 * @author bright
 */

const { Result } = require('../constant')
const {
  paramsError,
  existedError,
  delError,
  addError,
  updateError,
} = require('../constant/error-type')
const {
  add,
  delById,
  updateName,
  findByName,
  findAll,
} = require('../service/category-service')

class CategoryController {
  // 新增水果类别
  async addFruitCate(req, res, next) {
    const { name } = req.body
    // 检查请求参数
    if (!name || name.length > 15) {
      res.send(paramsError)
      return
    }
    try {
      const cate = await findByName(name)
      // 类别已存在, 新增失败
      if (cate) {
        res.send(existedError)
        return
      }
      // 新增
      const result = await add(name)
      if (result) {
        res.send(new Result(200, 'ok', result))
      } else {
        res.send(addError)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 删除水果类别
  async delFruitCate(req, res, next) {
    const { id } = req.body
    // 检查请求参数
    if (typeof id !== 'number') {
      res.send(paramsError(400, 'params_error'))
      return
    }
    try {
      const result = await delById(id)
      if (result > 0) {
        res.send(new Result(200, 'ok'))
      } else {
        res.send(delError)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 查询所有类别, 可根据名称模糊匹配
  async findFruitsCate(req, res, next) {
    const { name } = req.query
    try {
      const result = await findAll(name)
      res.send(new Result(200, 'ok', result))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 根据 id 更改类别名称
  async updateFruitCate(req, res, next) {
    const { id, name } = req.body
    // 校验参数
    if (typeof id !== 'number' || !name || name.length > 15) {
      res.send(paramsError(400, 'params_error'))
      return
    }
    try {
      const cate = await findByName(name)
      if (cate && cate.id !== id) {
        res.send(existedError)
        return
      }
      const result = await updateName(id, name)
      if (result[0] > 0) {
        res.send(new Result(200, 'ok'))
      } else {
        res.send(updateError)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = new CategoryController()
