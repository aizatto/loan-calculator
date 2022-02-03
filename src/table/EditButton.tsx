import { useState } from 'react'
import { Modal, Button, Form } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { Details, LoanFormDTO } from '../components/types'
import { LoanForm } from '../components/LoanForm'

interface Props {
  record: Details
  onChange: (values: any) => Details
  onUpdate: (values: LoanFormDTO) => void
  onDuplicate: (values: LoanFormDTO) => void
}

export const EditButton: React.FC<Props> = (props) => {
  const [form] = Form.useForm()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleOk = () => {
    setIsModalVisible(false)
    form.submit()
  }

  const handleDuplicate = () => {
    props.onDuplicate(form.getFieldsValue())
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<EditOutlined />} />
      <Modal
        title="Edit"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Update
          </Button>,
          <Button key="duplicate" type="primary" onClick={handleDuplicate}>
            Save as Duplicate
          </Button>,
        ]}
      >
        <LoanForm
          form={form}
          initialValues={props.record}
          onChange={props.onChange}
          onFinish={props.onUpdate}
          disableSubmit
        />
      </Modal>
    </>
  )
}
