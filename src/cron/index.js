/**
 * @desciption 定时任务
 * @author bright
 */

const delUserTask = require('./del-user')

function timedTask() {
  delUserTask.start()

  return delUserTask
}

module.exports = timedTask