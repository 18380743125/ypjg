import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

import { Card, Button, Checkbox, Form, Input, message } from 'antd'
import {
  UserOutlined,
  LockOutlined,
  SafetyOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import Cookies from 'js-cookie'
import { login } from '@/api/base'

import './index.scss'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const captchaRef = useRef(null)

  // 记住密码, 从 cookie 中读取
  const account: any = Cookies.get('account')
  const accountObj =  JSON.parse(account || null)

  // 点击登录
  const onFinish = (values: any) => {
    login(values).then(({ data: {msg} }) => {
      if(msg === 'ok') {
        message.success('登录成功')
        navigate('/', { replace: true })
        return
      } else if(msg === 'captcha_error') {
        message.error('验证码错误')
      } else if(msg === 'login_error') {
        message.error('用户名或密码错误')
      } else {
        message.error('服务器繁忙, 请稍后再试')
      }
      switchCaptcha()
    })
  }

  // 切换验证码
  const switchCaptcha = () => {
    if(!captchaRef.current) return
    const e = captchaRef.current as HTMLImageElement
    e.src = `/api/base/getCaptcha?t=${Math.random()}`
  }
  // 初始获取验证码
  useEffect(() => {
    switchCaptcha()
  })

  return (
    <div className="login">
      <Card className="wrapper">
        <div className="title">益品佳果</div>
        <Form
          className="form"
          initialValues={{ remember: accountObj, uname: accountObj?.uname, pwd: accountObj?.pwd }}
          onFinish={onFinish}>
          {/* 用户名 */}
          <Form.Item
            name="uname"
            rules={[
              { required: true, message: '用户名不能为空' },
              { min: 2, max: 20, message: '用户名限制在2~20个字符' },
            ]}>
            <Input
              autoComplete="off"
              allowClear
              prefix={<UserOutlined />}
              placeholder="请输入用户名"
            />
          </Form.Item>
          {/* 密码 */}
          <Form.Item
            name="pwd"
            rules={[
              { required: true, message: '密码不能为空' },
              { min: 6, max: 18, message: '密码限制在6~18个字符' },
            ]}>
            <Input.Password
              autoComplete="off"
              prefix={<LockOutlined />}
              placeholder="请输入密码"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          {/* 验证码图片 */}
          <div style={{ position: 'absolute', right: '20px', top: '100px' }}>
            <img
              ref={captchaRef}
              onClick={switchCaptcha}
              alt="加载失败"
              width={180}
              height={50}
            />
          </div>
          {/* 验证码输入框 */}
          <Form.Item
            name="captcha"
            wrapperCol={{ span: 10 }}
            rules={[{ required: true, message: '验证码不能为空' }]}>
            <Input
              maxLength={4}
              prefix={<SafetyOutlined />}
              placeholder="请输入验证码"
            />
          </Form.Item>
          {/* 记住密码 */}
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          {/* 登录提交按钮 */}
          <Form.Item className="login-btn">
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login
