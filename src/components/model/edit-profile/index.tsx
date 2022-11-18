import React, { memo, useState } from 'react'
import { Modal, Form, Input, Cascader, Button, Toast } from 'antd-mobile'
import { pcaOptions } from '@/utils'
import { updateProfile } from '@/service/modules/user'

type Props = {
  profile: Record<string, any>
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

const EditProfile = memo((props: Props) => {
  const { profile, visible, handleCancel, handleOk } = props
  const [visibleSel, setVisibleSel] = useState(false)
  const [address, setAddress] = useState<string[]>(
    profile?.address?.split('/') || []
  )
  const [form] = Form.useForm()
  return (
    <Modal
      visible={visible}
      content={
        <>
          <h5>用户名：{profile?.uname}</h5>
          <Form form={form} initialValues={{ phone: profile?.phone }}>
            <Form.Item
              name="phone"
              label="手机号"
              rules={[{ required: true, message: '手机号不能为空' }]}>
              <Input
                maxLength={11}
                autoComplete=""
                placeholder="请输入手机号"
              />
            </Form.Item>
          </Form>
          <br />
          <Button
            onClick={() => setVisibleSel(true)}
            color="primary"
            size="mini">
            选择收货地址
          </Button>
          <div style={{ marginTop: 10, paddingLeft: 2 }}>
            地址：{address.join('/')}
          </div>
          <Cascader
            options={pcaOptions}
            visible={visibleSel}
            onClose={() => {
              setVisibleSel(false)
            }}
            value={address}
            onConfirm={(v: string[]) => {
              setAddress(v)
            }}
          />
        </>
      }
      closeOnAction
      closeOnMaskClick
      onClose={handleCancel}
      actions={[
        {
          key: 'ok',
          text: '确认',
          onClick: async () => {
            try {
              const { phone } = await form.validateFields()
              const { uname } = profile
              const { data: res } = await updateProfile({ uname, phone, address: address.join('/') })
              if (res.msg === 'ok') {
                Toast.show('修改成功！')
                handleOk()
              }
            } catch (err) {}
          },
        },
      ]}
    />
  )
})

export default EditProfile
