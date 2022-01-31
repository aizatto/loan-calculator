import { Table } from 'antd'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { LoanForm } from '../components/LoanForm'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { setDocumentTitle } from '../hooks/setDocumentTitle'

const calculateLoan = (dto: LoanFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    dto.downPaymentFixed = dto.price * (dto.downPaymentPercentage / 100)
  }

  const loanSize = dto.price - dto.downPaymentFixed
  const totalInterest =
    (dto.interestRate / 100) * loanSize * dto.loanPeriodYears
  const totalLoanCost = loanSize + totalInterest
  const lifetimeCost = totalLoanCost + dto.downPaymentFixed
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)
  const monthly = lifetimeCost / (dto.loanPeriodYears * 12)

  return {
    key: (Math.random() + 1).toString(36).substring(7),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    monthly,
  }
}

export const CarPage: React.FC = () => {
  setDocumentTitle(`Car Loan Calculator`)
  const [values, setValues] = useState<Details[]>([
    calculateLoan({
      price: 260000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 26000,
      loanPeriodYears: 9,
      interestRate: 2.5,
    }),
  ])

  const onFinish = (dto: LoanFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateLoan(dto))
    setValues(newValues)
  }

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
      title: 'Monthly',
      dataIndex: 'monthly',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
    },
    {
      title: 'Down Payment',
      dataIndex: 'downPaymentFixed',
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
      title: 'Lifetime Cost',
      dataIndex: 'lifetimeCost',
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
  ]

  return (
    <>
      <Helmet>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${process.env.PUBLIC_URL}/favicons/car/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.PUBLIC_URL}/favicons/car/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.PUBLIC_URL}/favicons/car/favicon-16x16.png`}
        />
      </Helmet>
      <h1>Car Loan Calculator</h1>
      <LoanForm
        initialValues={values[0]}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
      />
      <Table columns={columns} dataSource={values} pagination={false} />
    </>
  )
}
