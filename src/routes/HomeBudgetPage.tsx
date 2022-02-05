import { Table } from 'antd'
import { Helmet } from 'react-helmet'
import { BudgetForm } from '../components/BudgetForm'
import { BudgetFormDTO, Details, DownPaymentType } from '../components/types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const calculateMortage = (dto: BudgetFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.FIXED) {
    return mortageFixed(dto)
  } else {
    const mortage = mortagePercent(dto)
    return mortage
  }
}

const mortageFixed = (dto: BudgetFormDTO): Details => {
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

// https://en.wikipedia.org/wiki/Mortgage_calculator
const mortagePercent = (dto: BudgetFormDTO): Details => {
  const months = dto.loanPeriodYears * 12
  const rate = dto.interestRate / 100 / 12

  const totalLoanCost = dto.monthly * months

  const loanSize = (dto.monthly * (1 - Math.pow(1 + rate, -1 * months))) / rate
  const totalInterest = totalLoanCost - loanSize

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

export const HomeBudgetPage: React.FC = () => {
  const [values, setValues] = useLocalStorage<Details[]>('home-budget', [
    calculateMortage({
      monthly: 10000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentFixed: 100000,
      downPaymentPercentage: 10,
      loanPeriodYears: 35,
      interestRate: 2.88,
    }),
  ])

  const onFinish = (dto: BudgetFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateMortage(dto))
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
      <Helmet>
        <title>Home Budget Calculator</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${process.env.PUBLIC_URL}/favicons/home/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${process.env.PUBLIC_URL}/favicons/home/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${process.env.PUBLIC_URL}/favicons/home/favicon-16x16.png`}
        />
      </Helmet>
      <div className="p-3">
        <h1>Reverse Home Loan Calculator</h1>
        <p>Calculate what home you can afford based on your monthly budget</p>
        <BudgetForm
          initialValues={values[0]}
          onChange={(values) => {
            return calculateMortage(values)
          }}
          onFinish={onFinish}
        />
      </div>
      <Table columns={columns} dataSource={values} pagination={false} />
    </>
  )
}
