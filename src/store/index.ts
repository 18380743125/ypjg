import React from 'react'
import CartStore from './cart.store'

class RootStore {
  public cartStore: Record<string, any>
  // 组合模块
  constructor() {
    this.cartStore = new CartStore()
  }
}

// 导入 useStore 方法供组件使用数据
const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)
