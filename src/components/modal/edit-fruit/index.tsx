import { useCallback, useEffect, useState } from 'react'
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
import { updateFruit } from '@/api/fruit'
import { pcaOptions, getBase64, checkImageFormat } from '@/utils'

const { Option } = Select

type Props = {
  visible: boolean
  cates: Array<any>
  fruit: any
  handleOk: () => void
  handleCancel: () => void
}

export default function EditFruit({
  visible,
  cates,
  fruit,
  handleOk,
  handleCancel,
}: Props) {
  let {
    name,
    category_id: category,
    weight,
    price,
    product_address: address,
  } = fruit || {}
  weight && (weight = parseFloat(weight))
  price && (price = parseFloat(price))
  address && (address = address.split('/'))

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

  // 初始化上传图片列表
  const initUrl = useCallback(() => {
    const dir = '/uploads'
    if (!fruit) return
    setUrlFileList([
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: dir + fruit?.url,
      },
    ])
    setCarouselFileList(
      fruit?.carousel_url.map((item: string, index: number) => {
        return {
          uid: index,
          name: 'image.png',
          status: 'done',
          url: dir + item,
        }
      }) || []
    )
  }, [fruit])
  useEffect(() => {
    initUrl()
  }, [initUrl])

  // 监听编辑确认
  const onFinish = async (values: any) => {
    if (values.url && values.url.fileList.length !== 0) {
      values.url = values.url.fileList[0].originFileObj
    } else {
      values.url = null
    }
    if (values.carouselUrl) {
      const urls = values.carouselUrl.fileList.filter(
        (item: any) => item && item.originFileObj
      )
      if (urls.length > 0) {
        values.carouselUrl = urls.map((item: any) => item.originFileObj)
      } else {
        values.carouselUrl = null
      }
    }
    if (!values.url && urlFileList.length === 0) {
      message.error('列表图不能为空！')
      return
    }
    if (!values.carousel_url && carouselFileList.length === 0) {
      message.error('轮播图不能为空！')
      return
    }
    // 拿到将移除的图片
    const removeUrl = []
    // 未改变的 img
    const unchangeUrl = []
    for (let c of carouselFileList) {
      if (c.url) unchangeUrl.push(c.url)
    }
    for (let c of fruit.carousel_url) {
      const cUrl = '/uploads' + c
      if (unchangeUrl.indexOf(cUrl) === -1) {
        removeUrl.push(cUrl)
      }
    }
    if (values.url) removeUrl.push('/uploads' + fruit.url)
    // 将未改变的字段剔除掉
    if (values.name === fruit.name) delete values.name
    if (values.category === fruit.category_id) delete values.category
    if (values.unit === 'kg') values.weight *= 1000
    if (values.weight === parseFloat(fruit.weight)) delete values.weight
    if (values.price === parseFloat(fruit.price)) delete values.price
    values.address = values.address.join('/')
    if (values.address === fruit.product_address) delete values.address
    delete values.unit
    for (let key in values) {
      if (!values[key]) delete values[key]
    }
    // 未发送改变, 无需请求更改
    if(Object.keys(values).length === 0 && removeUrl.length === 0) {
      handleCancel()
      return
    }
    const { data: res } = await updateFruit({ removeUrl, fruit_no: fruit.fruit_no, ...values })
    if(res.msg === 'ok') {
      message.success('更新成功！')
      handleOk()
    }
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

  return (
    <Modal
      bodyStyle={{ height: 640 }}
      title={<div style={{ color: '#1890ff' }}>编辑水果</div>}
      centered
      maskClosable={false}
      destroyOnClose={true}
      visible={visible}
      footer={null}
      onCancel={() => {
        initUrl()
        handleCancel()
      }}
      width={880}>
      <Form
        preserve={false}
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{ name, unit, category, weight, price, address }}>
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
        <Form.Item name="url" label="列表图">
          <Upload {...urlUploadProps}>
            {urlFileList.length >= 1 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item name="carouselUrl" label="轮播图">
          <Upload {...carouselUploadProps}>
            {carouselFileList.length >= 3 ? null : uploadButton}
          </Upload>
        </Form.Item>

        <Form.Item wrapperCol={{ span: 3, offset: 20 }}>
          <Button block type="primary" htmlType="submit">
            确认
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
