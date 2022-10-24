import React, { useState } from 'react'
import { Modal, message, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd'
import { RcFile } from 'antd/lib/upload'

import * as XLSX from 'xlsx'

import { bulkUpdateStock } from '@/api/stock'

type Props = {
  visible: boolean
  handleOk: () => void
  handleCancel: () => void
}

export default function ImportStock(props: Props) {
  const { visible, handleCancel, handleOk } = props
  // excel 文件
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)

  const loadExcel = async (cb: Function) => {
    const file = fileList[0] as RcFile
    const reader = new FileReader()
    reader.addEventListener('load', (e: any) => {
      const data = new Uint8Array(e.target.result)
      // 解析得到工作薄
      const wb = XLSX.read(data, { type: 'array' })
      // 第一张工作表名
      const sheet1 = wb.SheetNames[0]
      // 第一张工作表内容
      const worksheet = wb.Sheets[sheet1]
      let result = XLSX.utils.sheet_to_json(worksheet) // 使用 utils 里的方法转换内容为便于使用的数组
      result = result.map((item: any) => ({
        fruit_no: item['水果编号'],
        stockNum: item['库存/份数'],
      }))
      cb(result)
    })
    // 读取数据
    reader.readAsArrayBuffer(file)
  }
  const onSubmit = async () => {
    // 解析完 excel 数据之后的回调
    loadExcel(async (result: Array<Record<string, any>>) => {
      setLoading(true)
      const { data: res } = await bulkUpdateStock(result)
      if (res.msg === 'ok') {
        setLoading(false)
        message.success('导入成功！')
        setFileList([])
        handleOk()
      } else if (res.msg === 'stock_less') {
        message.error('库存不足！')
        setLoading(false)
      }
    })
  }

  const uploadProps: UploadProps = {
    name: 'stock',
    fileList,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const low20MB = file.size / 1024 / 1024 < 20
      const checkSuffix = ['.xlsx', 'xls'].includes(
        file.name.slice(file.name.lastIndexOf('.'))
      )
      if (low20MB && checkSuffix) {
        setFileList([])
        setTimeout(() => {
          setFileList([file])
        }, 100)
      }
      if (!low20MB) {
        message.error('文件大小不能超过20MB！')
      } else if (!checkSuffix) {
        message.error('文件格式错误！')
      }
      return false
    },
  }
  return (
    <Modal
      title={<span style={{ color: '#1890ff' }}>导入库存</span>}
      cancelText="取消"
      okText='提交'
      okButtonProps={{ loading: loading }}
      centered
      maskClosable={false}
      visible={visible}
      forceRender={true}
      onOk={onSubmit}
      onCancel={() => handleCancel()}>
      <Upload {...uploadProps} maxCount={1}>
        <Button style={{ color: '#1890ff' }} icon={<UploadOutlined />}>
          点击导入
        </Button>
      </Upload>
      <h4 style={{ color: 'red', marginTop: 16 }}>
        注意：仅支持导入 excel
        文件，其中工作表的列由水果编号、水果名称、库存变化量组成，每次只能导入一个文件。
      </h4>
    </Modal>
  )
}
