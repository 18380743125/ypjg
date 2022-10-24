/**
 * @desciption 定时任务 删除用户账号 (注销账号 n 天后)
 * @author bright
 */

const CronJob = require('cron').CronJob
const { delUsers } = require('../service/users-service')
const { DEL_USER_TASK_TIME } = require('../constant')

async function _do() {
  const result = await delUsers()
  console.log(`删除已注销账号的用户的定时任务已执行完成, 共删除：${result}条`)
}

function delUserTask() {
  const task = new CronJob(
    DEL_USER_TASK_TIME,
    _do,
    null,
    false,
    'Asia/Shanghai'
  )
  return task
}

module.exports = delUserTask()
