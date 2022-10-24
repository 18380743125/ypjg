/**
 * @description 连接 mysql
 * @author bright
 */

const { Sequelize } = require('sequelize')

const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PWD,
  MYSQL_DB,
} = require('../../config/config.default')

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PWD, {
  dialect: 'mysql',
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  timezone: '+08:00',
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: console.log,
})

;(async () => {
  try {
    await sequelize.authenticate()
    console.log('MySQL Connection has been established successfully.')
  } catch (error) {
    console.error('MySQL Unable to connect to the database:', error)
  }
})()

module.exports = sequelize
