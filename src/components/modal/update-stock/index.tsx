import React, { useState } from 'react'
import { Modal, message, InputNumber } from 'antd'
import { StockOutlined } from '@ant-design/icons'

import { updateStock } from '@/api/stock'

type Props = {
  stock: Record<string, any>
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function UpdateStock(props: Props) {
  const { stock, visible, handleCancel, handleOk } = props
  const [stockNum, setStockNum] = useState('')

  const onSave = async () => {
    
    const { data: res } = await updateStock(stock.fruit_no, stockNum)
    if (res.msg === 'ok') {
      message.success('更新成功！')
      setStockNum('')
      handleOk()
    }
  }
  return (
    <Modal
      title={<span style={{ color: '#1890ff' }}>修改库存</span>}
      cancelText="取消"
      okText="保存"
      centered
      maskClosable={false}
      visible={visible}
      forceRender={true}
      onOk={onSave}
      onCancel={() => {
        handleCancel()
        setStockNum('')
      }}>
      <h4>水果名称：{stock.name}</h4>
      <h4>水果编号：{stock.fruit_no}</h4>
      <h4>当前库存：{stock.stock} 份</h4>
      <InputNumber
        prefix={<StockOutlined style={{ marginRight: 6 }} />}
        style={{ width: 260, marginBottom: 10 }}
        placeholder="请输入库存"
        value={stockNum}
        onChange={(num) => setStockNum(num)}
        maxLength={6}
      />
      <h4 style={{ color: 'red' }}>
        注意：输入的库存必须为更改的数量，
        比如增加库存10份，则输入10；减少库存10份，输入-10
      </h4>
    </Modal>
  )
}
