import { Modal, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

interface Props {
  onDelete: () => void
}

export const DeleteButton: React.FC<Props> = (props) => {
  return (
    <>
      <Button
        type="primary"
        icon={<DeleteOutlined />}
        onClick={() => {
          Modal.confirm({
            title: 'Are you sure you want to delete this row?',
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
              props.onDelete()
            },
          })
        }}
      />
    </>
  )
}
