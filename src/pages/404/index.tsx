import React from 'react'
import { useNavigate } from 'react-router-dom'

import './index.scss'

export default function NotFount() {
  const navigate = useNavigate()
  const back = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/users/my')
  }
  return (
    <div className="not-fount">
      <div className="wrapper">
        <h1>404</h1>
        <p>The Page not Found - 找不到你要访问的页面</p>
        <div className="sub">
          <p>
            <a href='/' onClick={back}>
              Back
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
