import { lazy } from 'react'
import { Navigate, RouteObject } from 'react-router-dom'

const Home = lazy(() => import('@/pages/home'))
const Shop = lazy(() => import('@/pages/shop'))
const Cart = lazy(() => import('@/pages/cart'))
const Profile = lazy(() => import('@/pages/profile'))

const Login = lazy(() => import('@/pages/login'))
const Register = lazy(() => import('@/pages/register'))
const PayResult = lazy(() => import('@/pages/pay-result'))

const routes: Array<RouteObject> = [
  {
    path: '/',
    element: <Navigate to="/shop" />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/shop',
    element: <Shop />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/profile',
    element: <Profile />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/pay-result',
    element: <PayResult />,
  },
  {
    path: '*',
    element: <Navigate to="/shop" />,
  },
]

export default routes
