// 响应成功
class Result {
  constructor(status, msg, data = '') {
    this.status = status
    this.msg = msg
    this.data = data
  }
}

// 定期删除已注销的账号 触发时间
const DEL_USER_TASK_TIME = '59 59 23 * * *'

// 注销账号达到多少天达到删除的条件
const LOGOUT_ACCOUNT_DAYS = 7

// session 签名
const SESSION_SIGN = 't_bright'

module.exports = {
  Result,
  SESSION_SIGN,
  DEL_USER_TASK_TIME,
  LOGOUT_ACCOUNT_DAYS,
}
