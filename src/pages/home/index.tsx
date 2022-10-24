import { memo } from 'react'
import YPNavBar from '@/components/nav-bar'

import './index.less'

const Home = memo(() => {
  return (
    <div className='home'>
      {/* 导航栏 */}
      <YPNavBar title='首页' backArrow={null} />
    </div>
  )
})

export default Home