import { useCallback, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import * as XLSX from 'xlsx'
import {
  Input,
  Button,
  Image,
  Select,
  Skeleton,
  Table,
  ConfigProvider,
  Modal,
  message,
} from 'antd'
import {
  SearchOutlined,
  DownloadOutlined,
  ImportOutlined,
} from '@ant-design/icons'
import zhCN from 'antd/es/locale/zh_CN'
import type { ColumnsType } from 'antd/es/table'

import UpdateStock from '@/components/modal/update-stock'
import ImportStock from '@/components/modal/import-stock'
import { getStocks, putAwayOrUnshelve } from '@/api/stock'
import { useStore } from '@/store'
import { createWs } from '@/utils'
import './index.scss'

const { Option } = Select
const { confirm } = Modal

function Stock() {
  // 拿到水果类别
  const { fruitCategoryStore } = useStore()
  if (!fruitCategoryStore.category) {
    fruitCategoryStore.getCates()
  }

  const [currentPage, setcurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')
  const [category, setCategory] = useState(0)
  const [stocks, setStocks] = useState([])
  // 更新库存的弹出层
  const [visibleUpdate, setVisibleUpdate] = useState(false)
  // 导入库存的弹出层
  const [visibleImport, setVisibleImport] = useState(false)
  // 正在更新库存的水果
  const [stock, setStock] = useState(null)

  // 加工数据
  const processData = (rows: any) => {
    return rows.map((item: Record<string, any>) => {
      item.cname = item.fruit.cFruit.name
      delete item.fruit.cFruit
      for (let key in item.fruit) {
        item[key] = item.fruit[key]
      }
      delete item.fruit
      return item
    })
  }
  // 加载库存列表数据
  const loadData = useCallback(async () => {
    const { data: res } = await getStocks({
      currentPage,
      pageSize,
      name,
      category,
    })
    if (res.msg === 'ok') {
      setCount(res.data.count)
      // 加工数据
      const data = processData(res.data.rows)
      setStocks(data)
    }
  }, [currentPage, pageSize, name, category])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 上架
  const putAway = (fruit_no: string, state: string) => {
    if (state === '1') {
      return message.info('该商品已上架了哦~')
    }
    confirm({
      title: '你确认要上架吗？',
      async onOk() {
        const { data: res } = await putAwayOrUnshelve(fruit_no, '1')
        if (res.msg === 'ok') {
          message.success('上架成功')
          loadData()
        }
      },
    })
  }
  // 下架
  const unshelve = (fruit_no: string, state: string) => {
    if (state === '0') {
      return message.info('该商品已下架了哦~')
    }
    confirm({
      title: '你确认要下架吗？',
      async onOk() {
        const { data: res } = await putAwayOrUnshelve(fruit_no, '0')
        if (res.msg === 'ok') {
          message.success('下架成功')
          loadData()
        }
      },
    })
  }

  // 监听下载库存表
  const onDownload = async () => {
    const { data: res } = await getStocks({ currentPage: 1, pageSize: 1000000 })
    let data = processData(res.data.rows)
    data = data.map((item: Record<string, any>) => {
      const { category_id, createdTime, id, url, updatedTime, ...rest } = item
      rest.state = rest.state === '1' ? '已上架' : '未上架'
      rest.weight =
        parseInt(rest.weight) > 1000
          ? (parseInt(rest.weight) / 1000).toFixed(2) + 'kg'
          : rest.weight + 'g'
      return rest
    })

    const fields = [
      'fruit_no',
      'name',
      'cname',
      'weight',
      'stock',
      'sales_quantity',
      'state',
    ]
    const titles = {
      fruit_no: '水果编号',
      name: '水果名称',
      cname: '类别',
      weight: '重量/每份',
      stock: '库存/份数',
      sales_quantity: '销售数量/份',
      state: '状态',
    }
    // 将数据转成workSheet
    let sheet = createWs(data, fields, titles)
    sheet['!cols'] = [{ width: 20 }]
    // 工作薄
    const wb = {
      SheetNames: ['sheet'],
      Sheets: {
        sheet,
      },
    }
    // 将workBook写入文件
    XLSX.writeFile(wb, '库存表.xlsx')
  }

  // 表格列
  const columns: ColumnsType<any> = [
    {
      title: '图片',
      dataIndex: 'url',
      align: 'center',
      width: 120,
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
      width: 180,
      align: 'center',
    },
    {
      title: '水果名称',
      dataIndex: 'name',
      width: 200,
      align: 'center',
    },
    {
      title: '类别',
      dataIndex: 'cname',
      align: 'center',
      width: 110,
    },
    {
      title: '重量/每份',
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
      title: '库存/份数',
      dataIndex: 'stock',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return value > 10000 ? value / 10000 + ' 万' : value
      },
    },
    {
      title: '销量/份数',
      dataIndex: 'sales_quantity',
      align: 'center',
      width: 120,
      render: (value: number) => {
        return value > 10000 ? value / 10000 + '万' : value
      },
    },
    {
      title: '状态',
      dataIndex: 'state',
      align: 'center',
      width: 100,
      render: (value) =>
        parseInt(value) === 1 ? (
          <span style={{ color: '#1890ff' }}>已上架</span>
        ) : (
          <span style={{ color: '#ff7270' }}>未上架</span>
        ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 190,
      render: (_, record: any) => {
        return (
          <div>
            <Button
              onClick={() => {
                setStock(record)
                setVisibleUpdate(true)
              }}
              size="small"
              type="default"
              style={{ marginRight: 4 }}>
              更新库存
            </Button>
            <Button
              onClick={() => putAway(record.fruit_no, record.state)}
              size="small"
              type="ghost"
              style={{ marginRight: 4 }}>
              上架
            </Button>
            <Button
              onClick={() => unshelve(record.fruit_no, record.state)}
              type="ghost"
              danger
              size="small">
              下架
            </Button>
          </div>
        )
      },
    },
  ]
  return (
    <div className="stock">
      {/* 更新库存的弹出层 */}
      {stock && (
        <UpdateStock
          stock={stock}
          visible={visibleUpdate}
          handleCancel={() => setVisibleUpdate(false)}
          handleOk={() => {
            setVisibleUpdate(false)
            loadData()
          }}
        />
      )}
      {/* 导入库存的弹出层 */}
      <ImportStock
        visible={visibleImport}
        handleCancel={() => setVisibleImport(false)}
        handleOk={() => {
          setVisibleImport(false)
          loadData()
        }}
      />
      {/* 操作区域 */}
      <div style={{ marginBottom: 10, position: 'relative' }}>
        <Input
          style={{ width: 200 }}
          value={name}
          onChange={(e) => setName(e.target.value)}
          prefix={<SearchOutlined />}
          placeholder="请输入水果名称"
        />
        {fruitCategoryStore.category && (
          <Select
            value={category}
            onChange={(c) => setCategory(c)}
            style={{ marginLeft: 20, width: 100 }}
            placeholder="全部类别"
            optionFilterProp="children"
            notFoundContent="无">
            <Option key="category" value={0}>
              全部类别
            </Option>
            {fruitCategoryStore.category.map(
              (item: { id: number; name: string }) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              )
            )}
          </Select>
        )}
        {/* 批量更新库存 */}
        <div style={{ position: 'absolute', right: 6, top: 0 }}>
          <Button
            onClick={() => setVisibleImport(true)}
            style={{ color: '#1890ff', marginRight: 6 }}
            icon={<ImportOutlined />}>
            导入库存
          </Button>
          <Button
            onClick={onDownload}
            style={{ color: '#1890ff' }}
            icon={<DownloadOutlined />}>
            导出
          </Button>
        </div>
      </div>
      {/* 库存列表 */}
      {!stocks ? (
        <Skeleton active avatar paragraph={{ rows: 17 }} />
      ) : (
        <ConfigProvider locale={zhCN}>
          <Table
            style={{ marginBottom: 30 }}
            rowKey={(record: any) => record.id}
            dataSource={stocks || []}
            columns={columns}
            locale={{ emptyText: '暂无数据' }}
            size="small"
            pagination={{
              size: 'default',
              current: currentPage,
              pageSize,
              total: count,
              showSizeChanger: true,
              onChange: (page) => setcurrentPage(page),
              onShowSizeChange: (_, pageSize) => setPageSize(pageSize),
            }}
          />
        </ConfigProvider>
      )}
    </div>
  )
}

export default observer(Stock)
