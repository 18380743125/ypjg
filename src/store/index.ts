import React from 'react'
import FruitCategoryStore from './fruitCategory.store'

class RootStore {
  public fruitCategoryStore: Record<string, any>
  // 组合模块
  constructor() {
    this.fruitCategoryStore = new FruitCategoryStore()
  }
}

// 导入 useStore 方法供组件使用数据
const StoresContext = React.createContext(new RootStore())
export const useStore = () => React.useContext(StoresContext)
