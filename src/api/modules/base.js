const express = require('express')
const router = express.Router()
const svgCaptcha = require('svg-captcha')

// 获取验证码
router.get('/getCaptcha', async (req, res, next) => {
  try {
    // 创建算数验证码
    const captcha = svgCaptcha.createMathExpr({
      noise: 4,
      mathMin: 1,
      mathMax: 60,
      color: true,
    })
    req.session.captcha = { text: captcha.text, date: Date.now() }
    req.session.save()
    console.log('生成的验证码：' + captcha.text)
    // 设置响应头
    res.set('content-type', 'image/svg+xml')
    res.send(captcha.data)
  } catch (err) {
    console.log(err)
    next(err)
  }
})

module.exports = router
