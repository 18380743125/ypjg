import { memo } from 'react'
import { Outlet } from 'react-router-dom'
import TabBar from '@/components/tab-bar'
import './index.less'

const Layout = memo(() => {
  return (
    <div className='layout'>
      <Outlet />
      <TabBar />
    </div>
  )
})

export default Layout
