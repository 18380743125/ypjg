import { memo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input, Toast } from 'antd-mobile'

import YPNavBar from '@/components/nav-bar'
import { register } from '@/service/modules/user'
import './index.less'

const Register = memo(() => {
  const navigate = useNavigate()
  const captchaRef = useRef(null)
  const [form] = Form.useForm()

  // 切换验证码
  const switchCaptcha = () => {
    if (!captchaRef.current) return
    const e = captchaRef.current as HTMLImageElement
    e.src = `/api/base/getCaptcha?t=${Math.random()}`
  }
  // 初始获取验证码
  useEffect(() => {
    switchCaptcha()
  })

  // 监听注册
  const onRegister = async (values: any) => {
    const { pwdAgain, ...params } = values
    if (pwdAgain !== params.pwd) {
      Toast.show('两次输入密码不一致')
      return
    }
    const { data: res } = await register(params)
    if (res.msg === 'ok') {
      Toast.show({ icon: 'success', content: '注册成功' })
      setTimeout(() => navigate('/login'), 2000)
      return
    } else if (res.msg === 'existed') {
      Toast.show('用户已存在')
    }
    switchCaptcha()
    form.resetFields(['captcha'])
  }

  const goBack = () => navigate(-1)
  return (
    <div className="register">
      {/* 导航栏 */}
      <YPNavBar title="注册" onBack={goBack} />
      <Form
        form={form}
        onFinish={onRegister}
        footer={
          <Button block type="submit" color="primary" size="large">
            注册
          </Button>
        }
      >
        <Form.Item
          name="uname"
          label="用户名"
          rules={[
            { required: true, message: '用户名不能为空' },
            { max: 20, message: '用户名不能超过20个字符' },
          ]}
        >
          <Input placeholder="请输入用户名" clearable />
        </Form.Item>
        <Form.Item
          name="pwd"
          label="密码"
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码长度在6~18个字符之间' },
          ]}
        >
          <Input
            autoComplete=""
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </Form.Item>
        <Form.Item
          name="pwdAgain"
          label="确认密码"
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码长度在6~18个字符之间' },
          ]}
        >
          <Input
            autoComplete=""
            type="password"
            placeholder="请输入密码"
            clearable
          />
        </Form.Item>
        {/* 验证码区域 */}
        <div style={{ position: 'relative' }}>
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              right: '20px',
              top: '14px',
            }}
          >
            <img
              ref={captchaRef}
              onClick={switchCaptcha}
              alt="加载失败"
              width={180}
              height={50}
            />
          </div>
        </div>
        {/* 验证码 */}
        <Form.Item
          name="captcha"
          label="验证码"
          rules={[
            { required: true, message: '验证码不能为空' },
            { max: 4, message: '验证码不能超过4位' },
          ]}
        >
          <Input placeholder="请输入验证码" />
        </Form.Item>
      </Form>
    </div>
  )
})

export default Register
