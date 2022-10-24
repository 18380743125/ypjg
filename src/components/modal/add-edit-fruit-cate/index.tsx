import { Modal, Form, Input, message } from 'antd'
import { addCate, updateCate } from '@/api/fruitCate'

type Props = {
  cate?: Record<string, any>
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function AddFruitCate(props: Props) {
  const { cate, visible, handleCancel, handleOk } = props
  const [form] = Form.useForm()

  const { name: initName } = cate || {}

  const onSubmit = async () => {
    try {
      const { name: cateName } = await form.validateFields(['name'])
      // 添加类别
      if (!cate) {
        const { data: res } = await addCate(cateName)
        if (res.msg === 'ok') {
          message.success('添加成功！')
          handleOk()
        } else if (res.msg === 'existed') {
          message.error('类别名称已存在！')
        }
      } else {
        // 修改类别
        const { data: res } = await updateCate(cate.id, cateName)
        if (res.msg === 'ok') {
          message.success('保存成功！')
          handleOk()
        } else if (res.msg === 'existed') {
          message.error('类别名称已存在！')
        }
      }
    } catch (err) {}
  }
  return (
    <Modal
      title={
        <span style={{ color: '#1890ff' }}>{cate ? '修改' : '添加'}类别</span>
      }
      cancelText="取消"
      okText={cate ? '保存' : '提交'}
      centered
      maskClosable={false}
      destroyOnClose={true}
      visible={visible}
      onOk={onSubmit}
      onCancel={handleCancel}>
      <Form layout="vertical" autoComplete="off" form={form} preserve={false}>
        {cate && (
          <Form.Item required label="当前类别名称" style={{ marginBottom: 16 }}>
            <Input style={{ marginTop: 6 }} value={initName} disabled={true} />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label={cate ? '新的类别名称' : '类别名称'}
          style={{ marginBottom: 4 }}
          rules={[
            { required: true, message: '名称不能为空' },
            { max: 15, message: '名称不能超过15个字符' },
          ]}>
          <Input
            style={{ marginTop: 6 }}
            placeholder={cate ? '请输入新的类别名称' : '请输入类别名称'}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
