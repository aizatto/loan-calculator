import { Table } from 'antd'
import { useState } from 'react'
import { BudgetForm } from '../components/BudgetForm'
import { BudgetFormDTO, Details, DownPaymentType } from '../components/types'
import { setDocumentTitle } from '../hooks/setDocumentTitle'

const calculateDTO = (dto: BudgetFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.FIXED) {
    return calculateDTOFixed(dto)
  } else {
    return calculateDTOPercent(dto)
  }
}

const calculateDTOFixed = (dto: BudgetFormDTO): Details => {
  const lifetimeCost =
    dto.monthly * dto.loanPeriodYears * 12 + dto.downPaymentFixed

  const totalLoanCost = lifetimeCost - dto.downPaymentFixed

  const totalInterest =
    totalLoanCost * ((dto.interestRate / 100) * dto.loanPeriodYears)
  const loanSize = totalLoanCost - totalInterest
  const price = loanSize + dto.downPaymentFixed
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)

  return {
    key: (Math.random() + 1).toString(36).substring(7),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    price,
  }
}

const calculateDTOPercent = (dto: BudgetFormDTO): Details => {
  const totalLoanCost = dto.monthly * dto.loanPeriodYears * 12

  const totalInterest =
    totalLoanCost * ((dto.interestRate / 100) * dto.loanPeriodYears)
  const loanSize = totalLoanCost - totalInterest
  dto.downPaymentFixed =
    loanSize * (1 / (1 - dto.downPaymentPercentage / 100)) - loanSize
  const price = loanSize + dto.downPaymentFixed
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)

  const lifetimeCost = totalLoanCost + dto.downPaymentFixed

  return {
    key: (Math.random() + 1).toString(36).substring(7),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    price,
  }
}

export const CarBudgetPage: React.FC = () => {
  setDocumentTitle(`Car Budget Calculator`)
  const [values, setValues] = useState<Details[]>([
    calculateDTO({
      monthly: 2000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentFixed: 26000,
      downPaymentPercentage: 10,
      loanPeriodYears: 9,
      interestRate: 2.5,
    }),
  ])

  const onFinish = (dto: BudgetFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateDTO(dto))
    setValues(newValues)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Monthly',
      dataIndex: 'monthly',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
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
      <h1>Reverse Car Loan Calculator</h1>
      <p>Calculate what car you can afford based on your monthly budget</p>
      <BudgetForm
        initialValues={values[0]}
        onChange={(values) => {
          return calculateDTO(values)
        }}
        onFinish={onFinish}
      />
      <Table columns={columns} dataSource={values} pagination={false} />
    </>
  )
}
