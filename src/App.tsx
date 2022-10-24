import React, { lazy, Suspense } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { Spin, message } from 'antd'

import Layout from '@/pages/layout'
import Login from '@/pages/login'

import './App.scss'

// 按需导入路由组件
const NotFount = lazy(() => import('@/pages/404'))
const UsersInfo = lazy(() => import('@/pages/users-info'))
const Profile = lazy(() => import('@/pages/profile'))

const FruitList = lazy(() => import('@/pages/fruit'))
const FruitType = lazy(() => import('@/pages/fruit-type'))
const Stock = lazy(() => import('@/pages/stock'))

const Seckill = lazy(() => import('@/pages/seckill'))
const SaleReport = lazy(() => import('@/pages/sale-report'))
const SaleChart = lazy(() => import('@/pages/sale-chart'))

const SaleAfter = lazy(() => import('@/pages/sale-after'))
const Order = lazy(() => import('@/pages/order'))
const Comment = lazy(() => import('@/pages/comment'))

message.config({
  duration: 2,
  maxCount: 1,
})

//路由懒加载
const lazyLoad = (Comp: React.FC) => {
  return (
    <Suspense
      fallback={
        <div
          style={{
            textAlign: 'center',
            marginTop: 200,
          }}>
          <Spin size="large" />
        </div>
      }>
      <Comp />
    </Suspense>
  )
}

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/users/my" />} />
            <Route path='users'>
              <Route index element={lazyLoad(UsersInfo)} />
              <Route path="my" element={lazyLoad(Profile)} />
              <Route path="*" element={<Navigate to="/not_fount" />} />
            </Route>
            <Route path="fruits">
              <Route index element={lazyLoad(FruitList)} />
              <Route path="type" element={lazyLoad(FruitType)} />
              <Route path="stock" element={lazyLoad(Stock)} />
              <Route path="*" element={<Navigate to="/not_fount" />} />
            </Route>
            <Route path="sales">
              <Route index element={lazyLoad(Seckill)} />
              <Route path="report" element={lazyLoad(SaleReport)} />
              <Route path="chart" element={lazyLoad(SaleChart)} />
              <Route path="*" element={<Navigate to="/not_fount" />} />
            </Route>
            <Route path="sales_after" element={lazyLoad(SaleAfter)} />
            <Route path="orders" element={lazyLoad(Order)} />
            <Route path="comment" element={lazyLoad(Comment)} />
            <Route path="*" element={<Navigate to="/not_fount" />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/not_fount" element={<NotFount />} />
          <Route path="*" element={<Navigate to="/not_fount" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
