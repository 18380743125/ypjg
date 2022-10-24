import { memo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input, Toast, Checkbox } from 'antd-mobile'
import Cookies from 'js-cookie'

import YPNavBar from '@/components/nav-bar'
import { login } from '@/api/base'
import './index.less'

const Login = memo(() => {
  const navigate = useNavigate()
  const captchaRef = useRef(null)
  const [form] = Form.useForm()
  // 记住密码, 从 cookie 中读取
  const account: any = Cookies.get('account')
  const accountObj = JSON.parse(account || null)

  // 切换验证码
  const switchCaptcha = () => {
    if (!captchaRef.current) return
    const e = captchaRef.current as HTMLImageElement
    e.src = `/api/base/getCaptcha?t=${Math.random()}`
  }
  // 初始获取验证码
  useEffect(() => {
    switchCaptcha()
  }, [])

  // 监听登录
  const onLogin = async (values: any) => {
    const { data: res } = await login(values)
    const msg = res.msg
    if (msg === 'ok') {
      Toast.show({ content: '登录成功', icon: 'success' })
      navigate('/home', { replace: true })
      return
    } else if (msg === 'captcha_error') {
      Toast.show('验证码错误')
    } else if (msg === 'login_error') {
      Toast.show('用户名或密码错误')
    }
    switchCaptcha()
    form.resetFields(['captcha'])
  }
  // 返回
  const goBack = () => navigate(-1)
  return (
    <div className="login">
      {/* 导航栏 */}
      <YPNavBar onBack={goBack} title="登录" />
      <div className="welcome">
        <div className="logo">LOGIN</div>
        <div className="text">欢迎回来！</div>
      </div>
      <Form
        form={form}
        onFinish={onLogin}
        footer={
          <Button block type="submit" color="primary" size="large">
            登录
          </Button>
        }
        initialValues={{
          remember: accountObj ? true : false,
          uname: accountObj?.uname,
          pwd: accountObj?.pwd,
        }}>
        <Form.Item
          name="uname"
          label="用户名"
          rules={[
            { required: true, message: '用户名不能为空' },
            { max: 20, message: '用户名不能超过20个字符' },
          ]}>
          <Input placeholder="请输入用户名" clearable />
        </Form.Item>
        <Form.Item
          name="pwd"
          label="密码"
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码长度在6~18个字符之间' },
          ]}>
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
            }}>
            <img
              ref={captchaRef}
              onClick={switchCaptcha}
              alt="加载失败"
              width={180}
              height={50}
            />
          </div>
          <Form.Item
            name="captcha"
            label="验证码"
            rules={[
              { required: true, message: '验证码不能为空' },
              { max: 4, message: '验证码不能超过4位' },
            ]}>
            <Input placeholder="请输入验证码" />
          </Form.Item>
        </div>
        {/* 记住密码与去注册 */}
        <div style={{ position: 'relative' }}>
          <Form.Item
            valuePropName="checked"
            layout="horizontal"
            name="remember">
            <Checkbox>记住密码</Checkbox>
          </Form.Item>
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              right: '20px',
              top: '18px',
              color: '#f7d30d'
            }}>
            <span onClick={() => navigate('/register')}>去注册</span>
          </div>
        </div>
      </Form>
    </div>
  )
})

export default Login
