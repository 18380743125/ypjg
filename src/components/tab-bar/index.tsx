import { memo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.less'

const YPTabBar = memo(() => {
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location

  const setRouteActive = (value: string) => {
    navigate(value)
  }

  const tabs = [
    {
      key: '/home',
      title: (key: string) => <span className={key === pathname ? 'active-text' : ''}>首页</span>,
      icon: (key: string) => <i className={`iconfont icon-home ${key === pathname ? 'active' : ''}`} />,
    },
    {
      key: '/shop',
      title: (key: string) => <span className={key === pathname ? 'active-text' : ''}>分类</span>,
      icon: (key: string) => <i className={`iconfont icon-categorynormal ${key === pathname ? 'active' : ''}`} />
    },
    {
      key: '/cart',
      title: (key: string) => <span className={key === pathname ? 'active-text' : ''}>购物车</span>,
      icon: (key: string) => <i className={`iconfont icon-cart ${key === pathname ? 'active' : ''}`} />
    },
    {
      key: '/profile',
      title: (key: string) => <span className={key === pathname ? 'active-text' : ''}>我的</span>,
      icon: (key: string) => <i className={`iconfont icon-wode ${key === pathname ? 'active' : ''}`} />
    },
  ]
  return (
    <div className='tab-bar'>
      <TabBar activeKey={ pathname } onChange={(value) => setRouteActive(value)}>
        {tabs.map((item) => (
          <TabBar.Item key={item.key} icon={item.icon(item.key)} title={item.title(item.key)} />
        ))}
      </TabBar>
    </div>
  )
})

export default YPTabBar
