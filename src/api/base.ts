import { AxiosPromise } from 'axios'
import request from './request'

interface ILoginFields {
  uname: string,
  pwd: string,
  captcha: string,
  remeber: boolean
}

// 登录
export function login(fields: ILoginFields): AxiosPromise {
  return request({
    url: '/api/users/login',
    method: 'POST',
    data: {
      ...fields,
      tag: 1
    }
  })
}

// 注销登录
export function logout() {
  return request({
    url: '/api/users/logoutLogin',
    method: 'POST'
  })
}

// 获取个人信息
export function getProfile() {
  return request({
    url: '/api/users'
  })
}

type UpdateParams = {
  uname: string
  admin_name: string
  age: number
  gender: string
}
// 修改个人信息
export function updateProfile(fields: UpdateParams) {
  return request({
    url: '/api/users',
    method: 'PATCH',
    data: fields
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

// 获取用户列表
type GetUsersParams = {
  uname: string
  currentPage: number
  pageSize: number
}
export function getUsers(params: GetUsersParams) {
  return request({
    url: '/api/users/getUsers',
    params
  })
}