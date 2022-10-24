import { useEffect, useRef, useState } from 'react'

import Draggable from 'react-draggable'
import type { DraggableData, DraggableEvent } from 'react-draggable'

import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  Radio,
  Cascader,
  Upload,
  message,
  RadioChangeEvent,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface'
import PreviewModal from '@/components/modal/preview-image'
import { AxiosResponse } from 'axios'

import { addFruit } from '@/api/fruit'
import { pcaOptions, getBase64, checkImageFormat } from '@/utils'

const { Option } = Select

// props type
type Props = {
  visible: boolean
  cates: Array<any>
  handleOk: () => void
  handleCancel: () => void
}

export default function AddFruit({ visible, cates, handleOk, handleCancel }: Props) {
  const draggleRef = useRef<HTMLDivElement>(null)
  // 是否可以拖拽
  const [disabled, setDisabled] = useState(false)
  // 拖拽边界
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  })
  // 重量的单位 g / kg
  const [unit, setUnit] = useState('g')
  // 是否预览列表 / 轮播图
  const [urlPreviewVisible, setUrlPreviewVisible] = useState(false)
  const [carouselPreviewVisible, setCarouselPreviewVisible] = useState(false)
  // 预览图的 base64
  const [previewImage, setPreviewImage] = useState('')
  // 列表图与轮播图
  const [urlFileList, setUrlFileList] = useState<UploadFile[]>([])
  const [carouselFileList, setCarouselFileList] = useState<UploadFile[]>([])

  // 预览时禁止拖拽
  useEffect(() => {
    if (urlPreviewVisible || carouselPreviewVisible) {
      setDisabled(true)
    }
  }, [setDisabled, urlPreviewVisible, carouselPreviewVisible])

  // 计算拖拽的边界
  const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = window.document.documentElement
    const targetRect = draggleRef.current?.getBoundingClientRect()
    if (!targetRect) {
      return
    }
    setBounds({
      left: -targetRect.left + uiData.x,
      right: clientWidth - (targetRect.right - uiData.x),
      top: -targetRect.top + uiData.y,
      bottom: clientHeight - (targetRect.bottom - uiData.y),
    })
  }

  // 监听表单提交
  const onFinish = (values: any) => {
    if (!values.url || values.url.fileList.length === 0) {
      message.error('列表图不能为空！')
      return
    }
    if (!values.carouselUrl || values.carouselUrl.fileList.length === 0) {
      message.error('轮播图不能为空！')
      return
    }
    values.address = values.address.join('/')
    // 加工图片文件
    values.url = values.url.fileList[0].originFileObj
    values.carouselUrl = values.carouselUrl.fileList.map(
      (item: any) => item.originFileObj
    )
    if (values.unit === 'kg') values.weight *= 1000
    addFruit(values).then((res: AxiosResponse) => {
      if (res.data.msg === 'ok') {
        message.success('添加成功！')
        setUrlFileList([])
        setCarouselFileList([])
        handleOk()
      }
    })
  }

  // 监听列表图与轮播图的改变
  const handleUrlChange: UploadProps['onChange'] = ({
    file,
    fileList: newFileList,
  }) => {
    const { isJpgOrPng, isLt2M } = checkImageFormat(file as RcFile)
    if (isJpgOrPng && isLt2M) {
      setUrlFileList(newFileList)
    }
  }
  const handleCarouselChange: UploadProps['onChange'] = ({
    file,
    fileList,
  }) => {
    const { isJpgOrPng, isLt2M } = checkImageFormat(file as RcFile)
    if (isJpgOrPng && isLt2M) {
      setCarouselFileList(fileList)
    }
  }

  // 列表图 props
  const urlUploadProps: UploadProps = {
    listType: 'picture-card',
    fileList: urlFileList,
    maxCount: 1,
    onRemove: (file) => {
      const index = urlFileList.indexOf(file)
      const newFileList = urlFileList.slice()
      newFileList.splice(index, 1)
      setUrlFileList(newFileList)
    },
    beforeUpload: (file) => {
      const { isJpgOrPng, isLt2M } = checkImageFormat(file)
      if (isJpgOrPng && isLt2M) {
        setUrlFileList([...urlFileList, file])
      }
      if (!isJpgOrPng) message.error('图片格式错误！')
      if (!isLt2M) message.error('图片大小不能超过2MB')
      return false
    },
    onChange: handleUrlChange,
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile)
      }
      setPreviewImage(file.url || (file.preview as string))
      setUrlPreviewVisible(true)
    },
  }
  // 轮播图 props
  const carouselUploadProps: UploadProps = {
    listType: 'picture-card',
    fileList: carouselFileList,
    maxCount: 3,
    multiple: true,
    onRemove: (file) => {
      const index = carouselFileList.indexOf(file)
      const newFileList = carouselFileList.slice()
      newFileList.splice(index, 1)
      setCarouselFileList(newFileList)
    },
    beforeUpload: (file) => {
      const { isJpgOrPng, isLt2M } = checkImageFormat(file)
      if (isJpgOrPng && isLt2M) {
        setCarouselFileList([...carouselFileList, file])
      }
      if (!isJpgOrPng) message.error('图片格式错误！')
      if (!isLt2M) message.error('图片大小不能超过2MB')
      return false
    },
    onChange: handleCarouselChange,
    onPreview: async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile)
      }
      setPreviewImage(file.url || (file.preview as string))
      setCarouselPreviewVisible(true)
    },
  }

  // 上传区域
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}>
        上传
      </div>
    </div>
  )

  // 关闭新增水果弹窗之前触发
  const onBeforeClose = () => {
    setUrlFileList([])
    setCarouselFileList([])
    handleCancel()
  }
  return (
    <Modal
      bodyStyle={{ height: 640 }}
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            color: '#1890ff',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false)
            }
          }}
          onMouseOut={() => {
            setDisabled(true)
          }}>
          添加水果
        </div>
      }
      centered
      destroyOnClose={true}
      maskClosable={false}
      visible={visible}
      footer={null}
      onCancel={onBeforeClose}
      modalRender={(modal) => (
        <Draggable
          disabled={disabled}
          bounds={bounds}
          onStart={(event, uiData) => onStart(event, uiData)}>
          <div ref={draggleRef}>{modal}</div>
        </Draggable>
      )}
      width={880}>
      <Form
        preserve={false}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ unit: 'g' }}>
        {/* 水果名称 */}
        <Form.Item
          label="名称"
          name="name"
          wrapperCol={{ span: 12 }}
          rules={[
            { required: true, message: '水果名称不能为空' },
            { max: 15, message: '名称不能超过15个字符' },
          ]}>
          <Input />
        </Form.Item>
        {/* 类别 */}
        <Form.Item
          label="类别"
          name="category"
          wrapperCol={{ span: 8 }}
          rules={[{ required: true, message: '水果类别不能为空' }]}>
          <Select
            showSearch
            placeholder="请选择水果类别"
            optionFilterProp="children"
            notFoundContent="无">
            {cates.map((item: { id: number; name: string }) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        {/* 重量 */}
        <Form.Item label="重量" required style={{ marginBottom: 0 }}>
          <Form.Item
            style={{ display: 'inline-block' }}
            name="weight"
            rules={[{ required: true, message: '重量不能为空' }]}>
            <InputNumber
              addonAfter={unit}
              min={0}
              max={999999}
              style={{ width: 184 }}
            />
          </Form.Item>
          <Form.Item
            label="单位"
            name="unit"
            wrapperCol={{ span: 18 }}
            style={{ display: 'inline-block', marginLeft: 30 }}>
            <Radio.Group
              value={unit}
              onChange={(e: RadioChangeEvent) => {
                setUnit(e.target.value)
              }}>
              <Radio value="g">克</Radio>
              <Radio value="kg">千克</Radio>
            </Radio.Group>
          </Form.Item>
        </Form.Item>
        {/* 价格 */}
        <Form.Item
          label="价格"
          name="price"
          rules={[{ required: true, message: '价格不能为空' }]}>
          <InputNumber prefix="￥" min={0} max={9999} style={{ width: 184 }} />
        </Form.Item>
        {/* 产地 */}
        <Form.Item
          rules={[{ required: true, message: '产地不能为空' }]}
          label="产地"
          name="address"
          wrapperCol={{ span: 8 }}>
          <Cascader options={pcaOptions} expandTrigger="hover" />
        </Form.Item>
        <PreviewModal
          previewImage={previewImage}
          visible={urlPreviewVisible}
          handleCancel={() => setUrlPreviewVisible(false)}
        />
        <PreviewModal
          previewImage={previewImage}
          visible={carouselPreviewVisible}
          handleCancel={() => setCarouselPreviewVisible(false)}
        />
        <Form.Item required name="url" label="列表图">
          <Upload {...urlUploadProps}>
            {urlFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item required name="carouselUrl" label="轮播图">
          <Upload {...carouselUploadProps}>
            {carouselFileList.length >= 3 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 3, offset: 20 }}>
          <Button block type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
