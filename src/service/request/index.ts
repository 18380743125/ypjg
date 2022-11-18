import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { YRequestConfig } from './type'

class BRequest {
  instance: AxiosInstance
  constructor(config: YRequestConfig) {
    this.instance = axios.create(config)
    // 全局拦截器
    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (err) => {
        Promise.reject(err)
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        return res
      },
      (err) => {
        Promise.reject(err)
      }
    )

    // 实例拦截器
    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.responseSuccessFn,
      config.interceptors?.responseFailFn
    )
  }

  request<T = any>(config: YRequestConfig<T>) {
    // 请求前处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config) as any
    }
    // 请求取消
    if (!config) Promise.reject('the single request was canceled.')
    return new Promise<T>((resolve) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 响应前处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
        })
        .catch((err) => Promise.reject(err))
    })
  }

  get<T = any>(config: AxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }

  post<T = any>(config: AxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }

  delete<T = any>(config: AxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }

  patch<T = any>(config: AxiosRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default BRequest
