import React from 'react'

import Version from '@/components/version'

import './index.scss'

export default function Order() {
  return (
    <div>
      <div className="order">
        <div style={{ height: 200 }}>hello</div>
        <div style={{ height: 200 }}>hello</div>
        <div style={{ height: 200 }}>hello</div>
        <div style={{ height: 200 }}>hello</div>
      </div>
      <Version />
    </div>
  )
}
