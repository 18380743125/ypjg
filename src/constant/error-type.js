/**
 * @description 错误类型
 * @author bright
 */

class ErrorResult {
  constructor(status, msg, detail = '') {
    this.status = status
    this.msg = msg
    this.detail = detail
  }
}

// 服务器相关
const serverError = new ErrorResult(500, 'failed', '服务器异常！')
const reqTooFreqError = new ErrorResult(200, 'busy', '系统繁忙！')

// 权限相关
const jsonWebTokenError = new ErrorResult(401, 'token_error', 'token无效! ')
const tokenExpiredError = new ErrorResult(401, 'expired', 'token已过期! ')
const captchaError = new ErrorResult(401, 'captcha_error', '验证码错误！')
const noAdminRights = new ErrorResult(401, 'no_admin_rights', '无管理员权限！')
const notFound = new ErrorResult(404, 'not_found')

// 业务相关 —— 通用
const existedError = new ErrorResult(409, 'existed')
const loginError = new ErrorResult(200, 'login_error', '用户名或密码错误！')
const pwdError = new ErrorResult(200, 'pwd_error', '密码错误！')
const paramsError = new ErrorResult(400, 'params_error', '参数错误')
const operationError = new ErrorResult(200, 'operation_error', '操作失败！')
const addError = new ErrorResult(200, 'add_error', '新增失败！')
const delError = new ErrorResult(200, 'del_error', '删除失败！')
const updateError = new ErrorResult(200, 'update_error', '更新失败！')

// 其他
const stockLessError = new ErrorResult(200, 'stock_less', '库存不足！')

module.exports = {
  ErrorResult,
  // 服务器相关
  serverError,
  reqTooFreqError,
  notFound,
  // 权限相关
  jsonWebTokenError,
  tokenExpiredError,
  captchaError,
  noAdminRights,
  // 业务相关 —— 通用
  existedError,
  loginError,
  pwdError,
  paramsError,
  operationError,
  addError,
  delError,
  updateError,
  existedError,
  // 其他
  stockLessError,
}
