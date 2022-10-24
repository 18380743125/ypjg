import { makeAutoObservable } from 'mobx'
import { save, getCarts } from '@/api/cart'

class CartStore {
  public carts: Array<Record<string, any>> = []
  constructor() {
    makeAutoObservable(this)
  }
  // 初始化购物车
  initCart = async () => {
    const { data: res } = await getCarts()
    if (res.msg === 'ok') {
      this.carts = res.data
    }
  }

  // 添加或者修改购物车
  addOrUpdate = (f: Record<string, any>, value: number) => {
    // 删除购物车
    if (value === 0) {
      const cart = this.carts.filter((item) => item.fruit_no !== f.fruit_no)
      this.carts = cart
      return
    }
    const carts = [...this.carts]
    const fruit = carts.find((item) => item.fruit_no === f.fruit_no)
    // 添加购物车
    if (!fruit) {
      carts.push(f)
      this.carts = carts
      return
    }
    // 修改
    fruit.count = value
    this.carts = carts
    this.save()
  }

  // 计算购物车中数量
  goodsNums = () => {
    return this.carts.reduce((pre, item) => pre + item.count, 0)
  }

  // checked的数量
  checkedNums = () => {
    return this.carts.filter((item) => item.checked).length
  }

  // 计算总价格
  goodsTotalPrice = () => {
    const money = this.carts.reduce((pre, item) => {
      if (item.checked) {
        pre = pre + parseFloat(item.price) * item.count
      }
      return pre
    }, 0)
    return money.toFixed(2)
  }

  // 根据水果id查询该水果的count
  findCountByCount = (fruit_no: string): number => {
    const fruit = this.carts.find((item) => item.fruit_no === fruit_no)
    return fruit ? fruit.count : 0
  }

  // 将购物车中数据保存至 mongodb 中
  save = async () => {
    // 加工购物车
    const carts = this.carts.map((item) => {
      const { fruit_no, name, weight, price, url, count, checked } = item
      return { fruit_no, name, weight, url, count, checked, price }
    })
    await save(carts)
  }

  // 选中/取消选中
  onChecked = (index: number, value: boolean) => {
    const newCarts = [...this.carts]
    newCarts[index].checked = value
    this.carts = newCarts
    this.save()
  }

  // 监听全选
  onCheckAll = async (value: boolean) => {
    const newCart = this.carts.map((item) => {
      item.checked = value
      return item
    })
    this.carts = newCart
    this.save()
  }

  // 是否全选
  isCheckAll = () => {
    const checkedSize = this.carts.filter((item) => item.checked).length
    return checkedSize === this.carts.length
  }
}
export default CartStore
