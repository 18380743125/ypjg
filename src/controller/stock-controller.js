/**
 * @description stock controller
 * @author bright
 */

const { Result } = require('../constant')
const {
  paramsError,
  updateError,
  operationError,
  stockLessError,
} = require('../constant/error-type')
const {
  getStocks,
  getStockByFruitNo,
  putAwayOrUnshelve,
  updateStock,
} = require('../service/stock-service')

class StockController {
  // 获取库存列表
  async getStocks(req, res, next) {
    const { name, category, currentPage = 1, pageSize = 10 } = req.query
    try {
      const result = await getStocks(name, category, currentPage, pageSize)
      return res.send(new Result(200, 'ok', result))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 上架下架
  async putAwayOrUnshelve(req, res, next) {
    const { fruit_no, state } = req.body
    if (!fruit_no || !state || state.length !== 1) {
      return res.send(paramsError)
    }
    try {
      const result = await putAwayOrUnshelve(fruit_no, state)
      if (result[0] > 0) {
        res.send(new Result(200, 'ok'))
      } else {
        res.send(operationError)
      }
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 更新库存
  async updateStock(req, res, next) {
    const { fruit_no, stockNum } = req.body
    try {
      const stock = await getStockByFruitNo(fruit_no)
      if (
        !stock ||
        typeof stockNum !== 'number' ||
        stock.stock + stockNum < 0
      ) {
        return res.send(updateError)
      }
      await updateStock(fruit_no, stockNum)
      res.send(new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }

  // 批量更新库存, 前端解析 excel 所得
  async bulkUpdateStock(req, res, next) {
    const { stocks } = req.body
    if (Object.prototype.toString.call(stocks) !== '[object Array]') {
      return res.send(paramsError(200, 'param_error', '参数错误'))
    }
    try {
      for (let item of stocks) {
        const stock = await getStockByFruitNo(item.fruit_no)
        if (!stock || typeof item.stockNum !== 'number') {
          return res.send(updateError)
        }
        if (stock.stock + item.stockNum < 0) {
          return res.send(stockLessError)
        }
        const result = await updateStock(item.fruit_no, item.stockNum)
        if (result[1] === 0) {
          return res.send(updateError)
        }
      }
      res.send(200, new Result(200, 'ok'))
    } catch (err) {
      console.log(err)
      next(err)
    }
  }
}

module.exports = new StockController()
