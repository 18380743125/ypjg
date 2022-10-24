import { useEffect, useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import {
  SideBar,
  Ellipsis,
  InfiniteScroll,
  List,
  Image,
  Stepper,
  Badge,
} from 'antd-mobile'

import YPNavBar from '@/components/nav-bar'
import CartMini from '@/components/cart-mini'
import { getCates } from '@/api/fruit-cate'
import { getFruits } from '@/api/fruit'
import { useStore } from '@/store'
import './index.less'

function formatWeight(w: string) {
  const weight = parseFloat(w)
  return weight > 1000 ? (weight / 1000).toFixed(1) + 'kg' : weight + 'g'
}

const Shop = () => {
  const navigate = useNavigate()
  const { cartStore } = useStore()
  const [cates, setCates] = useState(Array<Record<string, any>>)
  const [fruits, setFruits] = useState(Array<Record<string, any>>)
  const [activeKey, setActiveKey] = useState('')
  const [currentCate, setCurrentCate] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)

  // 加载类别
  const loadFruitCates = async () => {
    const { data: res } = await getCates()
    if (res.msg === 'ok') {
      setCates(res.data)
    }
  }
  // 加载类别对应的水果
  const loadFruits = useCallback(
    async (fruits: Array<Record<string, any>>, p: number) => {
      const { data: res } = await getFruits({
        category: currentCate,
        currentPage: p,
        pageSize: 10,
      })
      if (res.msg === 'ok') {
        const { rows } = res.data
        // 加工数据
        rows.map((item: any) => {
          const count = cartStore.findCountByCount(item.fruit_no)
          if (count > 0) item.count = count
          return item
        })
        setFruits([...fruits, ...rows])
        if (rows.length === 0) {
          setHasMore(false)
        }
      } else {
        setHasMore(false)
      }
    },
    [currentCate, cartStore]
  )

  useEffect(() => {
    if (cartStore.carts.length === 0) cartStore.initCart()
  }, [cartStore])

  // 加载水果类别及对应水果
  useEffect(() => {
    loadFruitCates()
    loadFruits([], 1)
  }, [loadFruits])

  // 离开该页面时触发, 将购物车信息保存至 mongodb
  useEffect(() => {
    return () => {
      cartStore.save()
    }
  }, [cartStore])

  // 监听类别切换
  const onKeyChange = (value: string) => {
    const cate = cates.find((item) => item.name === value)
    setCurrentCate(cate?.id)
    setActiveKey(cate?.name)
  }
  // 下拉加载更多
  const loadMore = async () => {
    setPage(page + 1)
    await loadFruits(fruits, page)
  }

  // 加入购物车
  const addCart = (index: number, item: any) => {
    const [...newFruits] = fruits
    newFruits[index].count = 1
    newFruits[index].checked = true
    setFruits(newFruits)
    item.checked = true
    cartStore.addOrUpdate(item, 1)
  }
  return (
    <div className="shop">
      {/* 导航栏 */}
      <YPNavBar title="分类" backArrow={null} />
      <div className="wrapper">
        <SideBar
          className="side"
          style={{
            '--height': `${cartStore.carts.length === 0 ? '86vh' : '79vh'}`,
            '--width': '76px',
          }}
          activeKey={activeKey}
          onChange={(value) => onKeyChange(value)}>
          <SideBar.Item key="" title="全部" />
          {cates.map((item) => (
            <SideBar.Item
              key={item.name}
              title={<Ellipsis content={item.name} />}
            />
          ))}
        </SideBar>
        <div
          style={{ height: `${cartStore.carts.length ? '83vh' : '86vh'}` }}
          className="content">
          <List>
            {fruits.map((item, index) => (
              <List.Item key={item.fruit_no}>
                <div className="list">
                  <Image
                    className="img"
                    src={'/uploads' + item.url}
                    fit="cover"
                  />
                  <div className="right">
                    <div className="title">
                      <span>{item.name} </span>
                      <span>{formatWeight(item.weight)} / 份</span>
                      <span className="cate">
                        {item.product_address.split('/')[0]}
                      </span>
                    </div>
                    <div className="price">原价：￥{item.original_price}</div>
                    <div className="price">优惠价：￥{item.original_price}</div>
                    <div className="stepper">
                      {item.count > 0 ? (
                        <Stepper
                          style={{
                            '--input-width': '30px',
                            '--button-text-color': '#f7d30d',
                            '--height': '24px',
                          }}
                          min={0}
                          max={10}
                          value={item.count}
                          onChange={(value) => {
                            const [...newFruits] = fruits
                            newFruits[index].count = value
                            setFruits(newFruits)
                            cartStore.addOrUpdate(item, value)
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            color: 'white',
                            padding: '6px 10px',
                            fontSize: 10,
                            borderRadius: 26,
                            background: '#f7d30d',
                          }}
                          onClick={() => addCart(index, item)}>
                          加入购物车
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </List.Item>
            ))}
          </List>
          <InfiniteScroll threshold={0} loadMore={loadMore} hasMore={hasMore} />
        </div>
      </div>
      {cartStore.carts.length ? (
        <CartMini
          left={
            <Badge content={cartStore.goodsNums()} style={{ '--top': '20%' }}>
              <i
                style={{ color: '#f7d30d', fontSize: 26 }}
                className="iconfont icon-icons_cart"></i>
            </Badge>
          }
          right={
            <>
              <span style={{ paddingLeft: 40, fontSize: 16, color: '#ff411c' }}>
                ￥{cartStore.goodsTotalPrice()}
              </span>
              <div
                onClick={() => navigate('/cart')}
                style={{
                  padding: '10px 30px',
                  color: '#fff',
                  background: '#f7d30d',
                  borderRadius: 26,
                  fontSize: 14,
                }}>
                去支付
              </div>
            </>
          }
        />
      ) : (
        ''
      )}
    </div>
  )
}

export default observer(Shop)
