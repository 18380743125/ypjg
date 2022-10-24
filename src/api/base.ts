import request from './request'

type UserFields = {
  uname: string,
  pwd: string,
  captcha: number
}
// 登录
export function login(fields: UserFields) {
  return request({
    url: '/api/users/login',
    method: 'POST',
    data: fields
  })
}

// 注册
export function register(params: UserFields) {
  return request({
    url: '/api/users',
    method: 'POST',
    data: params
  })
}

// 获取个人信息
export function getUser() {
  return request({
    url: '/api/users'
  })
}

// 注销登录
export function logout() {
  return request({
    url: '/api/users/logoutLogin',
    method: 'POST'
  })
}

// 修改密码
export function updatePwd(pwds: any) {
  return request({
    url: '/api/users/updatePwd',
    method: 'PATCH',
    data: pwds
  })
}

// 修改个人信息
export function updateProfile(fields: any) {
  return request({
    url: '/api/users',
    method: 'PATCH',
    data: fields
  })
}
