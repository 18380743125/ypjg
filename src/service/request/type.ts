import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface YInterceptors<T = AxiosResponse> {
  requestSuccessFn?: (config: AxiosRequestConfig) => AxiosRequestConfig | void
  requestFailFn?: (err: any) => any
  responseSuccessFn?: (res: T) => T
  responseFailFn?: (err: any) => any
}

export interface YRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: YInterceptors<T>
}
