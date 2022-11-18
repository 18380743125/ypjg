import { useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import qs from 'qs'
import {
  List,
  Image,
  Stepper,
  InfiniteScroll,
  Checkbox,
  Modal,
  Toast,
} from 'antd-mobile'
import CartMini from '@/components/cart-mini'
import YPNavBar from '@/components/nav-bar'
import { useStore } from '@/store'
import { getUser } from '@/service/modules/user'
import { handleOrder } from '@/service/modules/order'
import { setItem } from '@/utils'
import './index.less'

// 格式化重量
function formatWeight(w: string) {
  const weight = parseFloat(w)
  return weight > 1000 ? (weight / 1000).toFixed(1) + 'kg' : weight + 'g'
}

const Cart = () => {
  const navigate = useNavigate()
  const { cartStore } = useStore()
  const [user, setUser] = useState<Record<string, any>>()
  // 获取购物车信息
  useEffect(() => {
    const loadUser = async () => {
      const { data: res } = await getUser()
      if (res.msg === 'ok') setUser(res.data)
    }
    loadUser()
    if (cartStore.carts.length === 0) {
      cartStore.initCart()
    }
  }, [cartStore])
  // 离开该页面时触发, 将购物车信息保存至 mongodb
  useEffect(() => {
    return () => {
      cartStore.save()
    }
  }, [cartStore])

  // 支付
  const handlePay = async () => {
    if (cartStore.checkedNums() === 0) return
    if (!user?.phone || !user?.address) {
      Toast.show('请前往设置完善个人信息')
      return
    }
    // 将生成订单的商品
    const goods = cartStore.carts.filter((item: any) => item.checked)
    // 需要支付的金额
    const money = cartStore.goodsTotalPrice()
    const { data: res } = await handleOrder(goods, money)
    if (res.msg === 'ok') {
      let biz_content: any = qs.parse(res.data).biz_content
      const result = JSON.parse(biz_content)
      setItem('out_trade_no', result.out_trade_no)
      Modal.show({
        content: '等待支付',
        closeOnAction: true,
        actions: [
          {
            key: 'pay',
            text: '我已支付',
            onClick: () => {
              navigate('/payResult')
            }
          },
        ],
      })
    }
    window.open(res.data)
  }

  return (
    <div className="cart">
      {/* 导航栏 */}
      <YPNavBar title="购物车" backArrow={null} />
      <div
        style={{ height: `${cartStore.carts.length ? '83vh' : '86vh'}` }}
        className="content">
        <List>
          {cartStore.carts.map((item: any, index: number) => (
            <List.Item key={item.fruit_no}>
              <div className="list">
                <div className="checked">
                  <Checkbox
                    checked={item.checked}
                    onChange={(value) => cartStore.onChecked(index, value)}
                    style={{
                      '--icon-size': '18px',
                    }}></Checkbox>
                </div>
                <Image
                  className="img"
                  src={'/uploads' + item.url}
                  fit="cover"
                />
                <div className="right">
                  <div className="title">
                    <span>{item.name} </span>
                    <span>{formatWeight(item.weight)} / 份</span>
                  </div>
                  <div className="price">￥{item.price}</div>
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
                          cartStore.addOrUpdate(item, value)
                        }}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </List.Item>
          ))}
        </List>
        <InfiniteScroll loadMore={async () => {}} hasMore={false} />
      </div>
      {cartStore.carts.length ? (
        <CartMini
          left={
            <Checkbox
              onChange={(value) => cartStore.onCheckAll(value)}
              checked={cartStore.isCheckAll()}
              style={{ '--font-size': '13px' }}>
              全选
            </Checkbox>
          }
          right={
            <>
              <span style={{ paddingLeft: 40, fontSize: 16, color: '#ff411c' }}>
                ￥{cartStore.goodsTotalPrice()}
              </span>
              <div
                onClick={() => handlePay()}
                style={{
                  padding: '10px 30px',
                  color: '#fff',
                  background: '#f7d30d',
                  borderRadius: 26,
                  fontSize: 14,
                  opacity: `${cartStore.checkedNums() === 0 ? 0.62 : 1}`,
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

export default observer(Cart)
