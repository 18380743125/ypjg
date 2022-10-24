import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'

import { setItem, getItem } from '@/utils'

const instance: AxiosInstance = axios.create({
  timeout: 10000,
})

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const excludePaths = ['/api/users/login', '/api/base/getCaptcha', '/api/users/logoutLogin']
    if (!excludePaths.includes(config.url || '')) {
      const authorization = getItem('authorization')
      if (!authorization) {
        message.error('请先登录！', 2, () => (window.location.href = '/login'))
        return
      }
      config.headers && (config.headers.authorization = authorization)
    }

    return config
  },
  (err) => Promise.reject(err)
)

// 拦截响应
instance.interceptors.response.use(
  (res: AxiosResponse) => {
    const methods = ['post', 'patch']
    const { url, method } = res.config
    // 登录成功 / 修改个人信息 后设置或更新 token
    if (url?.indexOf('/api/users') !== -1 && methods.includes(method || 'PATCH')) {
      if (res.data.msg === 'ok') {
        const authorization = res.headers.authorization
        setItem('authorization', authorization)
      }
    }
    // 统一处理状态码, 给与用户提示信息
    const msg = res.data.msg
    switch (msg) {
      case 'failed':
        message.error('服务器异常！')
        break
      case 'busy':
        message.error('系统繁忙！')
        break
      case 'update_error':
        message.error('更新失败！')
        break
      case 'del_error':
        message.error('删除失败！')
        break
      case 'add_error':
        message.error('新增失败！')
        break
      case 'params_error':
        message.error('参数错误！')
        break
      case 'token_error':
        message.error('请先登录！', 2, () => (window.location.href = '/login'))
        break
      case 'expired':
        message.error(
          '登录已过期！',
          2,
          () => (window.location.href = '/login')
        )
        break
      case 'no_admin_rights':
        message.error('无管理员权限')
        break
      case 'captcha_error':
        message.error('验证码错误！')
        break
    }
    return res
  },
  (err) => Promise.reject(err)
)

const request = (config: AxiosRequestConfig) => instance(config)

export default request
