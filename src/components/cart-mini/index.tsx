import { memo } from 'react'
import './index.less'

type Props = {
  left: React.ReactNode
  right: React.ReactNode
}

const CartMini = memo((props: Props) => {
  const Left = props.left
  const Right = props.right
  return (
    <div className='cart-mini'>
      <div className='left'>{Left}</div>
      <div className='right'>{Right}</div>
    </div>
  )
})

export default CartMini