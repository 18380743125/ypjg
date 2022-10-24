import React, { lazy, Suspense } from 'react'
import { DotLoading } from 'antd-mobile'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Layout from '@/pages/layout'
import Home from '@/pages/home'
import Shop from '@/pages/shop'
import Cart from '@/pages/cart'
import Profile from '@/pages/profile'

import './App.less'


const Login = lazy(() => import('@/pages/login'))
const Register = lazy(() => import('@/pages/register'))
const PayResult = lazy(() => import('@/pages/pay-result'))

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
          <DotLoading />
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
            <Route index element={<Navigate to='/shop' />} />
            <Route path='home' element={<Home />} />
            <Route path='shop' element={<Shop />} />
            <Route path='cart' element={<Cart />} />
            <Route path='profile' element={<Profile />} />
          </Route>
          <Route path="/login" element={lazyLoad(Login)} />
          <Route path="/register" element={lazyLoad(Register)} />
          <Route path="/payResult" element={lazyLoad(PayResult)} />
          <Route path="*" element={<Navigate to="/shop" />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
