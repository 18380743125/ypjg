import React, { useState, useEffect, useCallback } from 'react'
import {
  Input,
  Button,
  Table,
  Select,
  Image,
  Popconfirm,
  message,
  ConfigProvider,
  Skeleton,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import zhCN from 'antd/es/locale/zh_CN'

import AddFruit from '@/components/modal/add-fruit'
import EditFruit from '@/components/modal/edit-fruit'

import { getFruits, delFruit } from '@/api/fruit'
import { findCates } from '@/api/fruitCate'
import './index.scss'

const { Option } = Select

export default function Fruit() {
  // 添加水果弹出层
  const [visible, setVisible] = useState(false)
  // 编辑水果弹出层
  const [editVisible, setEditVisible] = useState(false)
  // 分页参数及数据集
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [fruitName, setFruitName] = useState('')
  const [category, setCategory] = useState(0)
  // 列表数据
  const [fruits, setFruits] = useState(null)
  // 水果类别
  const [cates, setCates] = useState([])
  // 正在编辑的水果
  const [fruit, setFruit] = useState()

  // 获取数据
  const loadData = useCallback(async () => {
    const { data } = await getFruits({
      name: fruitName,
      currentPage,
      pageSize,
      category,
    })
    setTotalCount(data.data.count)
    setFruits(data.data.rows)
  }, [category, currentPage, pageSize, fruitName])
  useEffect(() => {
    loadData()
  }, [loadData])
  // 加载水果类别
  useEffect(() => {
    const loadCates = async () => {
      const res = await findCates()
      setCates(res.data.data)
    }
    loadCates()
  }, [])

  // 切换页面
  const onPageChange = (page: number) => {
    setCurrentPage(page)
  }
  const onCategorySwitch = (c: number) => {
    setCategory(c)
    setCurrentPage(1)
  }
  // 监听删除
  const onDel = async (row: any) => {
    const state = parseInt(row.state)
    if (state !== 1) {
      const { data: res } = await delFruit(row.fruit_no)
      console.log(res)

      if (res.msg === 'ok') {
        message.success('删除成功！')
        loadData()
      }
    } else {
      message.error('请先下架！')
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: '图片',
      dataIndex: 'url',
      align: 'center',
      width: 100,
      render: (value) => {
        return (
          <Image
            width={65}
            height={65}
            preview={false}
            src={'/uploads' + value}
            fallback="data:image/png;base64,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"
          />
        )
      },
    },
    {
      title: '编号',
      dataIndex: 'fruit_no',
      key: 'fruit_no',
      width: 150,
      align: 'center',
    },
    {
      title: '名称',
      dataIndex: 'name',
      width: 140,
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'cFruit',
      align: 'center',
      width: 90,
      render: (value) => value.name,
    },
    {
      title: '价格',
      dataIndex: 'original_price',
      align: 'center',
      width: 90,
      render: (value) => '$' + value,
    },
    {
      title: '优惠价',
      dataIndex: 'price',
      align: 'center',
      width: 90,
      render: (value) => '$' + value,
    },
    {
      title: '重量',
      dataIndex: 'weight',
      align: 'center',
      width: 90,
      render: (value) => {
        let unit = 'g'
        value = parseInt(value)
        if (value > 1000) {
          unit = 'kg'
          value = Math.floor(value / 1000).toFixed(1)
        }
        return value + unit
      },
    },
    {
      title: '标签',
      dataIndex: 'tag',
      align: 'center',
      width: 90,
      render: (value) => (value === null ? '无' : value),
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: 80,
      render: (value) => (parseInt(value) === 0 ? '未上架' : '已上架'),
    },
    {
      title: '产地',
      dataIndex: 'product_address',
      align: 'center',
      width: 180,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      render: (_, record: any) => {
        return (
          <div>
            <Button
              onClick={() => {
                setFruit(record)
                setEditVisible(true)
              }}
              size="small"
              type="primary"
              style={{ marginRight: 10 }}>
              编辑
            </Button>
            <Popconfirm
              title="你确认要删除吗？"
              onConfirm={() => onDel(record)}
              okText="确定"
              cancelText="取消"
              placement="topRight">
              <Button type="primary" danger size="small">
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  return (
    <div>
      {/* 添加水果的弹出层 */}
      <AddFruit
        visible={visible}
        cates={cates}
        handleOk={() => {
          setVisible(false)
          loadData()
        }}
        handleCancel={() => setVisible(false)}
      />
      {/* 编辑水果的弹出层 */}
      <EditFruit
        visible={editVisible}
        cates={cates}
        fruit={fruit}
        handleOk={() => {
          setEditVisible(false)
          loadData()
        }}
        handleCancel={() => {
          setEditVisible(false)
        }}
      />
      <div className="fruit">
        {/* 操作区域 */}
        <div className="handle">
          <Input
            value={fruitName}
            onChange={(e) => setFruitName(e.target.value)}
            prefix={<SearchOutlined />}
            placeholder="请输入水果名称"
          />
          <Button type="primary" onClick={() => setVisible(true)}>
            添加水果
          </Button>
          <Select
            value={category}
            onChange={(c) => onCategorySwitch(c)}
            style={{ marginLeft: 20, width: 100 }}
            placeholder="全部类别"
            optionFilterProp="children"
            notFoundContent="无">
            <Option key="category" value={0}>
              全部类别
            </Option>
            {cates.map((item: { id: number; name: string }) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        </div>
        {!fruits ? (
          <Skeleton active avatar paragraph={{ rows: 17 }} />
        ) : (
          <ConfigProvider locale={zhCN}>
            <Table
              style={{ marginBottom: 30 }}
              rowKey={(record: any) => record.fruit_no}
              dataSource={fruits || []}
              columns={columns}
              locale={{ emptyText: '暂无数据' }}
              size="small"
              pagination={{
                size: 'default',
                current: currentPage,
                pageSize,
                total: totalCount,
                showSizeChanger: true,
                onChange: onPageChange,
                onShowSizeChange: (_, pageSize) => setPageSize(pageSize),
              }}
            />
          </ConfigProvider>
        )}
      </div>
    </div>
  )
}
