import { useState } from 'react'
import { Modal, Button, Table } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { Details } from '../components/types'
import { AlignType } from 'rc-table/lib/interface'

interface Props {
  record: Details
}

interface DataSource {
  key: string
  month: number
  year: number
  interestPaid: number
  principlePaid: number
  totalPrinciplePaid: number
  totalInterestPaid: number
  totalPaid: number
  remainingPrinciple: number
  lifetimeCostRemaining: number
}

export const ViewButton: React.FC<Props> = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const record = props.record

  const months = record.loanPeriodYears * 12
  const dataSource: DataSource[] = []

  let totalPrinciplePaid = 0

  const rule78 = (months * (months + 1)) / 2
  for (let i = 0; i < months; i++) {
    const interestPaid = ((months - i) / rule78) * record.totalInterest
    const principlePaid = record.monthly - interestPaid
    totalPrinciplePaid += principlePaid

    dataSource.push({
      key: `${record.key}:${i}`,
      year: Math.floor(i / 12),
      month: i + 1,
      interestPaid,
      principlePaid,
      totalPrinciplePaid,
      totalInterestPaid: 0,
      totalPaid: (i + 1) * record.monthly,
      remainingPrinciple: record.price - totalPrinciplePaid,
      lifetimeCostRemaining: record.lifetimeCost - (i + 1) * record.monthly,
    })
  }

  const columns = [
    {
      title: 'Year',
      dataIndex: 'year',
      align: 'right' as AlignType,
    },
    {
      title: 'Month',
      dataIndex: 'month',
      align: 'right' as AlignType,
    },
    {
      title: 'Interest Paid',
      dataIndex: 'interestPaid',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Principle Paid',
      dataIndex: 'principlePaid',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Total Principle Paid',
      dataIndex: 'totalPrinciplePaid',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Remaining Principle',
      dataIndex: 'remainingPrinciple',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Total Paid',
      dataIndex: 'totalPaid',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Remaining Lifetime Cost',
      dataIndex: 'lifetimeCostRemaining',
      align: 'right' as AlignType,
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
  ]

  return (
    <>
      <Button type="primary" onClick={showModal} icon={<EyeOutlined />} />
      <Modal
        title="View"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
        ]}
        width={900}
      >
        <div>
          Price:
          {Number(record.price).toLocaleString()}
        </div>
        <div>
          Monthly:
          {Number(record.monthly).toLocaleString()}
        </div>
        <div>
          Down Payment:
          {Number(record.downPaymentFixed).toLocaleString()}
        </div>
        <div>
          Loan Period (Years):
          {Number(record.loanPeriodYears).toLocaleString()}
        </div>
        <div>
          Total Expected Interest:
          {Number(record.totalInterest).toLocaleString()}
        </div>
        <div>
          Expected Lifetime Cost:
          {Number(record.lifetimeCost).toLocaleString()}
        </div>
        <Table columns={columns} dataSource={dataSource} pagination={false} />
      </Modal>
    </>
  )
}
