import { Table } from 'antd'
import { Helmet } from 'react-helmet'
import { LoanForm } from '../components/LoanForm'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { useLocalStorage } from '../hooks/useLocalStorage'

const calculateLoan = (dto: LoanFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    dto.downPaymentFixed = dto.price * (dto.downPaymentPercentage / 100)
  }

  const months = dto.loanPeriodYears * 12
  const rate = dto.interestRate / 100 / 12

  const principle = dto.price - dto.downPaymentFixed
  const monthly = principle * (rate / (1 - Math.pow(1 + rate, -1 * months)))

  const lifetimeCost = monthly * months + dto.downPaymentFixed

  const totalInterest = lifetimeCost - principle
  const totalLoanCost = principle + totalInterest - dto.downPaymentFixed

  const monthlyInterest = totalInterest / months

  return {
    key: (Math.random() + 1).toString(36).substring(7),
    ...dto,
    loanSize: principle,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    monthly,
  }
}

export const HomePage: React.FC = () => {
  const [values, setValues] = useLocalStorage<Details[]>('home-loan', [
    calculateLoan({
      price: 1000000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 100000,
      loanPeriodYears: 35,
      interestRate: 2.88,
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
        <title>Home Loan Calculator</title>
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
        <h1>Home Loan Calculator</h1>
        <LoanForm
          initialValues={values[0]}
          onChange={(values) => {
            return calculateLoan(values)
          }}
          onFinish={onFinish}
        />
      </div>
      <Table columns={columns} dataSource={values} pagination={false} />
    </>
  )
}
