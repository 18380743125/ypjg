import { memo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  List,
  Image,
  Button,
  Popup,
  Dialog,
  Toast,
  Modal,
  Form,
  Input,
} from 'antd-mobile'
import { SetOutline } from 'antd-mobile-icons'
import YPNavBar from '@/components/nav-bar'
import { getUser, logout, updatePwd } from '@/service/modules/user'
import { removeItem } from '@/utils'
import './index.less'
import EditProfile from '@/components/model/edit-profile'

const Profile = memo(() => {
  const navigate = useNavigate()
  const [user, setuser] = useState<Record<string, any>>()
  // 设置的底部弹出层
  const [visibleSet, setVisibleSet] = useState(false)
  // 修改密码的弹出层
  const [visibleUpdatePwd, setVisibleUpdatePwd] = useState(false)
  const [pwdForm] = Form.useForm()
  // 编辑个人信息的弹出层
  const [visibleEdit, setVisibleEdit] = useState(false)

  const loadUser = async () => {
    const { data: res } = await getUser()
    if (res.msg === 'ok') {
      setuser(res.data)
    }
  }
  useEffect(() => {
    loadUser()
  }, [])

  // 监听注销登录
  const onLogoutLogin = async () => {
    setVisibleSet(false)
    Dialog.show({
      content: '确认注销登录吗？',
      closeOnAction: true,
      actions: [
        [
          {
            key: 'cancel',
            text: '取消',
          },
          {
            key: 'ok',
            text: '确认',
            bold: true,
            onClick: async () => {
              const { data: res } = await logout()
              if (res.msg === 'ok') {
                removeItem('authorization')
                Toast.show('注销成功！')
                setTimeout(() => navigate('/login'), 2000)
              }
            },
          },
        ],
      ],
    })
  }

  return (
    <div className="profile">
      {/* 导航栏 */}
      <YPNavBar title="我的" backArrow={null} />
      {/* 修改密码的弹出层 */}
      <Modal
        visible={visibleUpdatePwd}
        content={
          <Form form={pwdForm}>
            <Form.Item
              name="pwd"
              label="密码"
              rules={[
                { required: true, message: '密码不能为空' },
                { min: 6, max: 18, message: '密码限制在6~18个字符' },
              ]}>
              <Input
                maxLength={18}
                autoComplete=""
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item
              name="newPwd"
              label="新密码"
              rules={[
                { required: true, message: '密码不能为空' },
                { min: 6, max: 18, message: '密码限制在6~18个字符' },
              ]}>
              <Input
                maxLength={18}
                autoComplete=""
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
            <Form.Item
              name="newPwdAgain"
              label="确认新密码"
              rules={[
                { required: true, message: '密码不能为空' },
                { min: 6, max: 18, message: '密码限制在6~18个字符' },
              ]}>
              <Input
                maxLength={18}
                autoComplete=""
                type="password"
                placeholder="请输入密码"
              />
            </Form.Item>
          </Form>
        }
        closeOnAction
        closeOnMaskClick
        onClose={() => {
          setVisibleUpdatePwd(false)
        }}
        actions={[
          {
            key: 'ok',
            text: '确认',
            onClick: async () => {
              try {
                const pwds = await pwdForm.validateFields()
                if (pwds.newPwd !== pwds.newPwdAgain) {
                  Toast.show('两次输入不一致！')
                  return
                }
                const { data: res } = await updatePwd(pwds)
                if (res.msg === 'pwd_error') {
                  Toast.show('密码错误！')
                } else if (res.msg === 'ok') {
                  localStorage.clear()
                  await logout()
                  Toast.show('修改成功，请重新登录！')
                  setTimeout(() => (window.location.href = '/login'), 2000)
                }
              } catch (err) {}
            },
          },
        ]}
      />

      {/* 个人信息的弹出层 */}
      {visibleEdit && (
        <EditProfile
          profile={user || {}}
          visible={visibleEdit}
          handleCancel={() => setVisibleEdit(false)}
          handleOk={() => {
            setVisibleEdit(false)
            loadUser()
          }}
        />
      )}

      {/* 设置的弹出层 */}
      <Popup
        visible={visibleSet}
        onMaskClick={() => {
          setVisibleSet(false)
        }}
        bodyStyle={{ minHeight: '20vh' }}>
        <List>
          <List.Item
            onClick={() => {
              setVisibleEdit(true)
              setVisibleSet(false)
            }}>
            个人信息
          </List.Item>
          <List.Item
            onClick={() => {
              setVisibleUpdatePwd(true)
              setVisibleSet(false)
            }}>
            修改密码
          </List.Item>
          <List.Item onClick={() => onLogoutLogin()}>注销登录</List.Item>
        </List>
      </Popup>
      <div className="info">
        <div className="avatar">
          <Image width={60} src={'/uploads' + user?.avatar} />
        </div>
        <div style={{ marginLeft: 10, textAlign: 'center' }}>
          <div>{user?.uname}</div>
          <div style={{ color: '#f7d30d', paddingTop: 6 }}>普通会员</div>
        </div>
        <div className="account">
          <div>余额：{user?.balance}</div>
          <Button
            style={{ marginTop: 6, letterSpacing: 4 }}
            color="primary"
            size="mini">
            充值
          </Button>
        </div>
      </div>
      <List>
        <List.Item>
          <div className="order">
            <div>
              <i className="iconfont icon-daizhifu"></i>
              <div>待支付</div>
            </div>
            <div>
              <i className="iconfont icon-daishouhuo"></i>
              <div>待收货</div>
            </div>
            <div>
              <i className="iconfont icon-daipingjia"></i>
              <div>待评价</div>
            </div>
            <div>
              <i className="iconfont icon-tuikuantuihuo"></i>
              <div>退款/销后</div>
            </div>
            <div>
              <i className="iconfont icon-quanbudingdan"></i>
              <div>全部订单</div>
            </div>
          </div>
        </List.Item>
        {/* <List.Item
          prefix={<i className="iconfont icon-shouhuodizhi" />}
          onClick={() => {}}>
          收货地址
        </List.Item> */}
        {/* <List.Item prefix={<UnorderedListOutline />} onClick={() => {}}>
          账单
        </List.Item> */}
        <List.Item prefix={<SetOutline />} onClick={() => setVisibleSet(true)}>
          设置
        </List.Item>
      </List>
    </div>
  )
})

export default Profile
