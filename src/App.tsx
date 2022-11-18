import React, { Suspense } from 'react'
import { useRoutes } from 'react-router-dom'
import { DotLoading } from 'antd-mobile'

import routes from './routes'
import TabBar from '@/components/tab-bar'

function App() {
  return (
    <div className="app">
      <Suspense fallback={<DotLoading />}>
        <div className="page">{useRoutes(routes)}</div>
      </Suspense>
      <TabBar />
    </div>
  )
}

export default App
