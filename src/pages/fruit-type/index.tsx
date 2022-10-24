import React, { useCallback, useEffect, useState } from 'react'
import { Table, Input, Button, Popconfirm, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { SearchOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import AddEditFruitCate from '@/components/modal/add-edit-fruit-cate'
import { findCates, delCate } from '@/api/fruitCate'
import './index.scss'

export default function FruitType() {
  const [cates, setCates] = useState([])
  const [cateName, setCateName] = useState('')
  // 是否打开新增类别弹出层
  const [visibleAdd, setVisibleAdd] = useState(false)
  const [visibleEdit, setVisibleEdit] = useState(false)
  // 修改前的类别
  const [cate, setCate] = useState()

  // 加载数据
  const loadData = useCallback(async () => {
    const { data: res } = await findCates(cateName)
    if (res.msg === 'ok') setCates(res.data)
  }, [cateName])
  useEffect(() => {
    loadData()
  }, [loadData])

  // 监听删除
  const onDelCate = async (record: Record<string, number>) => {
    const { data: res } = await delCate(record.id)
    if (res.msg === 'ok') {
      message.success('删除成功！')
      loadData()
    }
  }

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      align: 'center',
    },
    {
      title: '类别名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
      align: 'center',
      render: (value) => {
        return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updatedTime',
      align: 'center',
      render: (value) => {
        return dayjs(value).format('YYYY/MM/DD HH:mm:ss')
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 170,
      render: (_, record: any) => {
        return (
          <div>
            <Button
              onClick={() => {
                setCate(record)
                setVisibleEdit(true)
              }}
              type="primary"
              style={{ marginRight: 10 }}>
              编辑
            </Button>
            <Popconfirm
              title="你确认要删除吗？"
              okText="确定"
              cancelText="取消"
              placement="topRight"
              onConfirm={() => onDelCate(record)}>
              <Button type="primary" danger>
                删除
              </Button>
            </Popconfirm>
          </div>
        )
      },
    },
  ]
  return (
    <div className="type">
      {/* 新增类别弹出层 */}
      <AddEditFruitCate
        visible={visibleAdd}
        handleOk={() => {
          setVisibleAdd(false)
          loadData()
        }}
        handleCancel={() => setVisibleAdd(false)}
      />
      {/* 修改类别弹出层 */}
      <AddEditFruitCate
        cate={cate}
        visible={visibleEdit}
        handleOk={() => {
          setVisibleEdit(false)
          loadData()
        }}
        handleCancel={() => setVisibleEdit(false)}
      />
      {/* 操作区域 */}
      <div className="handle">
        <Input
          value={cateName}
          onChange={({ target: { value } }) => setCateName(value)}
          prefix={<SearchOutlined />}
          placeholder="请输入水果名称"
        />
        <Button onClick={() => setVisibleAdd(true)} type="primary">
          添加类别
        </Button>
      </div>
      <Table
        columns={columns}
        rowKey={(record: any) => record.id}
        locale={{ emptyText: '暂无数据' }}
        dataSource={cates}
      />
    </div>
  )
}
