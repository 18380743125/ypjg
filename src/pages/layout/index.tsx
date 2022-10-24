import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Layout, Dropdown, Menu, MenuProps, Breadcrumb, message } from 'antd'
import {
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons'
import UpdatePwd from '@/components/modal/update-pwd'

import { logout } from '@/api/base'
import { removeItem } from '@/utils'

import './index.scss'
import logo from '@/assets/images/logo.png'
import avatar from '@/assets/images/avatar.png'

const { Header, Sider, Content } = Layout

const YPLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  // 修改密码的弹出层
  const [visibleUpdatePwd, setVisibleUpdatePwd] = useState(false)

  // 是否折叠菜单栏
  const [collapsed, setCollapsed] = useState(false)

  // 监听退出登录
  const onLogout = async () => {
    const result = await logout()
    if (result.data.msg === 'ok') {
      removeItem('authorization')
      message.success('注销登录成功', 2.5, () => navigate('/login'))
    }
  }
  // 修改密码
  // 头部设置区域下拉框内容项
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: <div onClick={() => setVisibleUpdatePwd(true)}>修改密码</div>,
        },
        {
          key: '2',
          label: <div onClick={onLogout}>退出登录</div>,
        },
      ]}
    />
  )

  // 面包屑
  const pathSnippets = location.pathname.split('/').filter((i) => i)
  const breadcrumbNameMap: Record<string, string> = {
    '/users': '用户管理',
    '/users/info': '用户信息',
    '/users/my': '我的信息',
    '/fruits': '水果管理',
    '/fruits/list': '水果列表',
    '/fruits/type': '水果类别',
    '/fruits/stock': '库存管理',
    '/sales': '销售管理',
    '/sales/seckill': '销售管理',
    '/sales/report': '销售报表',
    '/sales/chart': '图标分析',
    '/sales_after': '售后管理',
    '/orders': '订单管理',
    '/comment': '评论管理',
  }
  // 根据路径分析面包屑
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`
    return <Breadcrumb.Item key={url}>{breadcrumbNameMap[url]}</Breadcrumb.Item>
  })

  // 菜单栏中被选中和被打开的项 的 key
  const getKeys = () => {
    const t_keys = location.pathname
      .slice(1)
      .split('/')
      .filter((item) => item)
    if (t_keys.length === 1) {
      if (t_keys[0] === 'users') t_keys.push('1')
      if (t_keys[0] === 'fruits') t_keys.push('2')
      if (t_keys[0] === 'sales') t_keys.push('3')
    }
    if (t_keys.length === 0) {
      t_keys.push('users', '1')
    }
    return t_keys
  }
  // 监听菜单项的点击事件
  const onMenu: MenuProps['onClick'] = (e) => {
    const path =
      '/' +
      e.keyPath
        .filter((item) => !Number.isInteger(parseInt(item)))
        .reverse()
        .join('/')
    navigate(path)
  }
  // 菜单项类型
  type MenuItem = Required<MenuProps>['items'][number]
  // 生成菜单项
  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem {
    return {
      label,
      key,
      icon,
      children,
      type,
    } as MenuItem
  }
  // 导航菜单项
  const items: MenuProps['items'] = [
    getItem(
      '用户管理',
      'users',
      <i className="iconfont icon-24gl-portraitMaleInfo" />,
      [
        getItem('用户信息', '1', <i className="iconfont icon-yonghuliebiao" />),
        getItem('我的信息', 'my', <i className="iconfont icon-shouye" />),
      ]
    ),
    getItem('水果管理', 'fruits', <i className="iconfont icon-shuiguo" />, [
      getItem(
        '水果列表',
        '2',
        <i className="iconfont icon-chanpinliebiaopubuliumoshi" />
      ),
      getItem('水果类别', 'type', <i className="iconfont icon-navicon-cplb" />),
      getItem('库存管理', 'stock', <i className="iconfont icon-kucun" />),
    ]),
    getItem(
      '销售管理',
      'sales',
      <i className="iconfont icon-xiaoshouguanli" />,
      [
        getItem('秒杀管理', '3', <i className="iconfont icon-miaosha" />),
        getItem(
          '销售报表',
          'report',
          <i className="iconfont icon-baobiaoguanli" />
        ),
        getItem(
          '图表分析',
          'chart',
          <i className="iconfont icon-shujubaobiao" />
        ),
      ]
    ),
    getItem(
      '售后管理',
      'sales_after',
      <i className="iconfont icon-shouhouguanli" />
    ),
    getItem(
      '订单管理',
      'orders',
      <i className="iconfont icon-dingdanguanli" />
    ),
    getItem(
      '评论管理',
      'comment',
      <i className="iconfont icon-pinglunguanli" />
    ),
  ]
  return (
    <Layout>
      {/* 修改密码的弹出层 */}
      <UpdatePwd
        visible={visibleUpdatePwd}
        handleCancel={() => setVisibleUpdatePwd(false)}
        handleOk={() => setVisibleUpdatePwd(false)}
      />
      {/* 头部区域 */}
      <Header style={{ position: 'fixed', zIndex: 2, width: '100%' }}>
        <img src={logo} alt="logo" />
        <div className="title">益品佳果</div>
        {/* 展开与收缩导航栏 */}
        <div style={{ fontSize: 20, padding: '0 10px 0 68px' }}>
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </div>
        <div style={{ letterSpacing: 2 }}>欢迎光临后台管理系统</div>
        {/* 头部右侧区域 */}
        <div className="user-info">
          <img src={avatar} alt="avatar" />
          <div className="welcome">欢迎您，{'bright'} 管理员</div>
          <Dropdown className="setting" overlay={menu} placement="bottom" arrow>
            <div className="wrapper">
              <SettingOutlined style={{ fontSize: 16, paddingRight: 4 }} />
              <span style={{ letterSpacing: 2 }}>设置</span>
            </div>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        {/* 侧边栏 */}
        <Sider
          collapsed={collapsed}
          trigger={null}
          style={{
            overflowY: 'scroll',
            height: 'calc(100vh - 80px)',
            position: 'fixed',
            left: 0,
            top: 80,
            bottom: 0,
          }}>
          <Menu
            onClick={onMenu}
            defaultSelectedKeys={getKeys()}
            defaultOpenKeys={getKeys()}
            mode="inline"
            items={items}
          />
        </Sider>
        {/* 内容区域 */}
        <Content
          style={{ padding: `80px 0 0 ${collapsed ? '80px' : '200px'} ` }}>
          <div className="breadcrumb">
            <Breadcrumb>{breadcrumbItems}</Breadcrumb>
          </div>
          <div className="main">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default YPLayout
