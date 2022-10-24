import { Modal, Form, Input, message } from 'antd'

import { updatePwd, logout } from '@/api/base'

type Props = {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function UpdatePwd(props: Props) {
  const { visible, handleCancel, handleOk } = props

  const [form] = Form.useForm()

  const onSubmit = async () => {
    try {
      const pwds = await form.validateFields()
      if (pwds.newPwd !== pwds.newPwdAgain) {
        message.error('两次输入不一致！')
        return
      }
      const { data: res } = await updatePwd(pwds)
      if (res.msg === 'pwd_error') {
        message.error('密码错误！')
      } else if (res.msg === 'ok') {
        message.success('修改成功！')
        handleOk()
        localStorage.clear()
        await logout()
        setTimeout(() => {
          message.error('请重新登录！').then(() => (window.location.href = '/login'))
        }, 1500)
      }
    } catch (err) {}
  }
  return (
    <Modal
      title={<span style={{ color: '#1890ff' }}>修改密码</span>}
      cancelText="取消"
      okText="确认"
      centered
      maskClosable={false}
      destroyOnClose={true}
      visible={visible}
      forceRender={true}
      onOk={onSubmit}
      onCancel={() => {
        form.resetFields()
        handleCancel()
      }}>
      <Form layout="vertical" form={form} preserve={false}>
        <Form.Item
          name="pwd"
          label="原密码"
          style={{ marginBottom: 10 }}
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码限制在6~18个字符' },
          ]}>
          <Input.Password placeholder="请输入原密码" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="newPwd"
          label="新密码"
          style={{ marginBottom: 10 }}
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码限制在6~18个字符' },
          ]}>
          <Input.Password placeholder="请输入新密码" autoComplete="off" />
        </Form.Item>
        <Form.Item
          name="newPwdAgain"
          label="确认新密码"
          style={{ marginBottom: 10 }}
          rules={[
            { required: true, message: '密码不能为空' },
            { min: 6, max: 18, message: '密码限制在6~18个字符' },
          ]}>
          <Input.Password placeholder="请再次输入新密码" autoComplete="off" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
