import React from 'react'

import { Modal } from 'antd'

type Props = {
  visible: boolean,
  previewImage: string,
  handleCancel: (e: React.MouseEvent<HTMLElement>) => void
}

export default function PreviewModal(props: Props) {
  const { visible, previewImage, handleCancel } = props
  return (
    <Modal maskClosable={false} visible={visible} footer={null} onCancel={handleCancel}>
      <img alt="preview" style={{ width: '100%' }} src={previewImage} />
    </Modal>
  )
}
