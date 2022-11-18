import yRequest from '..'

interface UserFields {
  uname: string
  pwd: string
  captcha: number
}
// 登录
export function login(fields: UserFields) {
  return yRequest.post({
    url: '/api/users/login',
    data: fields,
  })
}

// 注册
export function register(params: UserFields) {
  return yRequest.post({
    url: '/api/users',
    data: params,
  })
}

// 获取个人信息
export function getUser() {
  return yRequest.get({
    url: '/api/users',
  })
}

// 注销登录
export function logout() {
  return yRequest.post({
    url: '/api/users/logoutLogin',
  })
}

// 修改密码
export function updatePwd(pwds: any) {
  return yRequest.patch({
    url: '/api/users/updatePwd',
    data: pwds,
  })
}

// 修改个人信息
export function updateProfile(fields: any) {
  return yRequest.patch({
    url: '/api/users',
    data: fields,
  })
}
