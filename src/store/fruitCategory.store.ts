import { makeAutoObservable } from "mobx"
import { findCates } from '@/api/fruitCate'

class LoginStore {
  category = null
  constructor() {
    makeAutoObservable(this)
  }
  getCates = async (name?: string) => {
    const { data: res } = await findCates(name)
    if(res.msg === 'ok') {
      this.category = res.data
    }
  }
}
export default LoginStore