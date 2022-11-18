import { Toast } from 'antd-mobile'

export function showError(msg: string) {
  switch (msg) {
    case 'failed':
      Toast.show('服务器异常！')
      break
    case 'busy':
      Toast.show('系统繁忙！')
      break
    case 'update_error':
      Toast.show('更新失败！')
      break
    case 'del_error':
      Toast.show('删除失败！')
      break
    case 'add_error':
      Toast.show('新增失败！')
      break
    case 'params_error':
      Toast.show('参数错误！')
      break
    case 'token_error':
      Toast.show('请先登录！')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      break
    case 'expired':
      Toast.show('登录已过期！')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      break
    case 'no_admin_rights':
      Toast.show('无管理员权限')
      break
    case 'captcha_error':
      Toast.show('验证码错误！')
      break
  }
}
