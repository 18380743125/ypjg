import type { AxiosResponse } from 'axios'
import { Toast } from 'antd-mobile'

import YRequest from './request'
import { TIME_OUT } from './config'
import type { YRequestConfig } from './request/type'
import { setItem, getItem, showError } from '@/utils'

function handleRequest(config: YRequestConfig) {
  const authorization = getItem('authorization')
  if (!authorization) {
    Toast.show({ content: '请先登录！' })
    setTimeout(() => {
      window.location.href = '/login'
    }, 2000)
    return
  }
  if (config.headers) {
    config.headers.authorization = authorization
  }
  return config
}

function handleResponse(res: AxiosResponse) {
  const authorization = res.headers.authorization
  if (authorization) setItem('authorization', authorization)
  showError(res.data.msg)
  return res
}

const yRequest = new YRequest({
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn(config: YRequestConfig) {
      return handleRequest(config)
    },
    responseSuccessFn(res: AxiosResponse) {
      return handleResponse(res)
    },
    requestFailFn(err) {
      Promise.reject(err)
    },
    responseFailFn(err) {
      Promise.reject(err)
    },
  },
})

export default yRequest
