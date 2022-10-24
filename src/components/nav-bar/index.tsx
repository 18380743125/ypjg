import React, { memo } from 'react'
import { NavBar } from 'antd-mobile'
import './index.less'

const YPNavBar = memo((props: any) => {
  return (
    <NavBar {...props} className="nav-bar">
      { props.title }
    </NavBar>
  )
})

export default YPNavBar
