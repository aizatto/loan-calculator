import { Form, Button, InputNumber, Input, Table } from 'antd'
import { useState } from 'react'

type DTOShort = {
  name?: string
  price: number
  downPayment: number
  loanPeriodYears: number
  interestRate: number
}

type DTOLong = DTOShort & {
  key: string
  loanSize: number
  totalInterest: number
  totalLoanCost: number
  totalCost: number
  monthlyInterest: number
  monthly: number
}

const calculateDTO = (dto: DTOShort): DTOLong => {
  const loanSize = dto.price - dto.downPayment
  const totalInterest =
    (dto.interestRate / 100) * loanSize * dto.loanPeriodYears
  const totalLoanCost = loanSize + totalInterest
  const totalCost = totalLoanCost + dto.downPayment
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)
  const monthly = totalCost / (dto.loanPeriodYears * 12)

  return {
    key: (Math.random() + 1).toString(36).substring(7),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    totalCost,
    monthlyInterest,
    monthly,
  }
}

export const CarPage: React.FC = () => {
  // export function CarPage() {
  const [values, setValues] = useState<DTOLong[]>([
    calculateDTO({
      price: 260000,
      downPayment: 26000,
      loanPeriodYears: 7,
      interestRate: 4,
    }),
  ])

  const onFinish = (dto: DTOShort) => {
    const newValues = values.slice(0)
    newValues.push(calculateDTO(dto))
    setValues(newValues)
  }

  const onFinishFailed = () => {}

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Down Payment',
      dataIndex: 'downPayment',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Loan Period (Years)',
      dataIndex: 'loanPeriodYears',
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      render: (value: number) => {
        return `${value} %`
      },
    },
    {
      title: 'Loan Size',
      dataIndex: 'loanSize',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Total Interest',
      dataIndex: 'totalInterest',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Total Loan Cost',
      dataIndex: 'totalLoanCost',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Total Cost',
      dataIndex: 'totalCost',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Monthly Interest',
      dataIndex: 'monthlyInterest',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Monthly',
      dataIndex: 'monthly',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
  ]

  return (
    <>
      <h1>Car Loan Calculator</h1>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={values[0]}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item label="name" name="name">
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: 'Please input your price!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Down Payment"
          name="downPayment"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputNumber />
        </Form.Item>

        <Form.Item
          label="Loan Period (Years)"
          name="loanPeriodYears"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputNumber addonAfter="years" />
        </Form.Item>

        <Form.Item
          label="Interest Rate (%)"
          name="interestRate"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <InputNumber formatter={(value) => `${value}%`} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={values} pagination={false} />
    </>
  )
}
