import { Modal, Form, Input, Radio, message, InputNumber } from 'antd'

import { updateProfile } from '@/api/base'
import { useEffect } from 'react'

type Props = {
  profile: Record<string, any>
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function EditProfile(props: Props) {
  const { profile, visible, handleCancel, handleOk } = props

  const [form] = Form.useForm()

  useEffect(() => {
    const { uname, admin_name, age, gender } = profile
    form.setFieldValue('uname', uname)
    form.setFieldValue('admin_name', admin_name)
    form.setFieldValue('age', age)
    form.setFieldValue('gender', gender)
  })

  const onSubmit = async () => {
    if(!profile) return
    try {
      const fields = await form.validateFields()
      // 剔除未发生改变的字段
      for(let key of Object.keys(fields)) {
        if(key === 'uname') continue
        if(fields[key] === profile[key]) { 
          delete fields[key]
        }
      }
      // 未发生变化, 无需发起请求修改
      if(Object.keys(fields).length === 1) {
        handleCancel()
        return
      }
      const { data: res } = await updateProfile(fields)
      if(res.msg === 'ok') {
        message.success('修改成功！')
        handleOk()
      }
      
    } catch (err) {}
  }
  return (
    <Modal
      title={<span style={{ color: '#1890ff' }}>修改信息</span>}
      cancelText="取消"
      okText="保存"
      centered
      maskClosable={false}
      destroyOnClose={true}
      visible={visible}
      forceRender={true}
      onOk={onSubmit}
      onCancel={handleCancel}>
      <Form
        autoComplete="off"
        form={form}
        preserve={false}>
        <Form.Item name="uname" label="用户名">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item
          name="admin_name"
          label="姓名"
          rules={[
            { required: true, message: '姓名不能为空' },
            { max: 20, message: '姓名不能超过20个字符' },
          ]}>
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item
          name="age"
          label="年龄"
          rules={[{ required: true, message: '年龄不能为空' }]}>
          <InputNumber
            style={{ width: 130 }}
            maxLength={3}
            min={0}
            placeholder="请输入年龄"
          />
        </Form.Item>
        <Form.Item
          required
          name="gender"
          label="性别"
          style={{ marginBottom: 4 }}>
          <Radio.Group>
            <Radio value="1">男</Radio>
            <Radio value="0">女</Radio>
            <Radio value="2">其他</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
