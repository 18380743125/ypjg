/**
 * @description cart Controller
 * @author bright
 */

const { Result } = require('../constant')
const { save, remove, update, getCart } = require('../service/cart-service')

function checkExist(oldCarts, fruit_no) {
  let isExist = false
  oldCarts.forEach((item) => {
    if (item.fruit_no === fruit_no) {
      isExist = true
      item.flag = 1
    }
  })
  return isExist
}

class CartController {
  async save(req, res, next) {
    const { uname } = req.user
    const { carts } = req.body
    try {
      const oldCart = await getCart(uname)
      for (let c of carts) {
        const isExist = checkExist(oldCart, c.fruit_no)
        // 新增
        if (!isExist) {
          await save(c, uname)
        } else {
          // 修改
          await update(uname, c.fruit_no, c.count, c.checked)
        }
      }
      // oldCart 未处理到的应删除
      for (let item of oldCart) {
        if (!item.flag) {
          await remove(item.fruit_no, uname)
        }
      }
      res.send(new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  async getCart(req, res, next) {
    const { uname } = req.user
    try {
      const result = await getCart(uname)
      console.log(result)
      res.send(new Result(200, 'ok', result))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = new CartController()
