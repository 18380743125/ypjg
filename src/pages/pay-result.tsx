import { memo, useEffect, useState } from 'react'
import { Result, Button } from 'antd-mobile'
import { useNavigate } from 'react-router-dom'
import YPNavBar from '@/components/nav-bar'
import { getItem } from '@/utils'
import { queryPayResult } from '@/service/modules/order'

const out_trade_no = getItem('out_trade_no')

const PaySuccess = memo(() => {
  const navigate = useNavigate()
  const [payResult, setPayResult] = useState('')
  useEffect(() => {
    async function queryResult() {
      if (!out_trade_no) return
      const { data: res } = await queryPayResult(out_trade_no)
      setPayResult(res)
      console.log(res);
    }
    queryResult()
  }, [])

  return (
    <div>
      <YPNavBar title="支付结果" backArrow={null} />
      <Result
        status={
          ['交易成功', '交易完成'].includes(payResult) ? 'success' : 'error'
        }
        title={payResult}
      />
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button onClick={() => navigate('/shop')} size="small" color="primary">
          返回首页
        </Button>
      </div>
    </div>
  )
})

export default PaySuccess
