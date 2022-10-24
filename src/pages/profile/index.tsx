import React, { useEffect, useState } from 'react'
import { Descriptions, Button } from 'antd'

import { getProfile } from '@/api/base'

import './index.scss'
import dayjs from 'dayjs'
import EditProfile from '@/components/modal/edit-profile'
import Version from '@/components/version'

export default function Profile() {
  const [profile, setProfile] = useState<Record<string, any>>()
  // 修改个人信息的弹出层
  const [visibleEdit, setVisibleEdit] = useState(false)
  // 加载个人信息
  const loadProfile = async () => {
    const { data: res } = await getProfile()
    if (res.msg === 'ok') {
      setProfile(res.data)
    }
  }
  useEffect(() => {
    loadProfile()
  }, [])

  return (
    <div>
      <div className="profile">
        {profile && (
          <EditProfile
            profile={profile}
            visible={visibleEdit}
            handleCancel={() => setVisibleEdit(false)}
            handleOk={() => {
              setVisibleEdit(false)
              loadProfile()
            }}
          />
        )}
        <Descriptions title="我的信息" bordered layout="vertical">
          <Descriptions.Item label="用户名">
            {profile && profile.uname}
          </Descriptions.Item>
          <Descriptions.Item label="姓名">
            {profile && (profile.admin_name || '暂无')}
          </Descriptions.Item>
          <Descriptions.Item label="性别">
            {profile &&
              (profile.gender === '1'
                ? '男'
                : profile.gender === '0'
                ? '女'
                : '其他')}
          </Descriptions.Item>
          <Descriptions.Item label="年龄">
            {profile && profile.age}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {profile &&
              dayjs(profile.createdTime).format('YYYY/MM/DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="操作">
            <Button type="primary" onClick={() => setVisibleEdit(true)}>
              修改信息
            </Button>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <Version />
    </div>
  )
}
