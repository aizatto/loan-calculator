import { Space, Table } from 'antd'
import { Helmet } from 'react-helmet'
import { LoanForm } from '../components/LoanForm'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DeleteButton } from '../table/DeleteButton'
import { EditButton } from '../table/EditButton'

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
  const defaultLoan = calculateLoan({
    price: 260000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 26000,
    loanPeriodYears: 9,
    interestRate: 2.5,
  })
  const [dataSource, setDataSource] = useLocalStorage<Details[]>('car-loan', [
    defaultLoan,
  ])

  const onFinish = (dto: LoanFormDTO) => {
    const newDataSource = dataSource.slice(0)
    newDataSource.unshift(calculateLoan(dto))
    setDataSource(newDataSource)
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: (a: Details, b: Details) =>
        a.name?.localeCompare(b.name ?? '') ?? 0,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.price - b.price,
    },
    {
      title: 'Monthly',
      dataIndex: 'monthly',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.monthly - b.monthly,
    },
    {
      title: 'Down Payment',
      dataIndex: 'downPaymentFixed',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) =>
        a.downPaymentFixed - b.downPaymentFixed,
    },
    {
      title: 'Loan Period (Years)',
      dataIndex: 'loanPeriodYears',
      sorter: (a: Details, b: Details) => a.loanPeriodYears - b.loanPeriodYears,
    },
    {
      title: 'Interest Rate',
      dataIndex: 'interestRate',
      render: (value: number) => {
        return `${value} %`
      },
      sorter: (a: Details, b: Details) => a.interestRate - b.interestRate,
    },
    {
      title: 'Loan Size',
      dataIndex: 'loanSize',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.loanSize - b.loanSize,
    },
    {
      title: 'Total Interest',
      dataIndex: 'totalInterest',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.totalInterest - b.totalInterest,
    },
    {
      title: 'Total Loan Cost',
      dataIndex: 'totalLoanCost',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.totalLoanCost - b.totalLoanCost,
    },
    {
      title: 'Lifetime Cost',
      dataIndex: 'lifetimeCost',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.lifetimeCost - b.lifetimeCost,
    },
    {
      title: 'Monthly Interest',
      dataIndex: 'monthlyInterest',
      render: (value: number) => {
        return Number(value).toLocaleString()
      },
      sorter: (a: Details, b: Details) => a.monthlyInterest - b.monthlyInterest,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_: any, record: Details) => {
        return (
          <Space>
            <EditButton
              record={record}
              onChange={(values) => {
                return calculateLoan(values)
              }}
              onUpdate={(values) => {
                const details = calculateLoan(values)
                const newDataSource = dataSource.slice(0)
                const index = newDataSource.indexOf(record)
                newDataSource[index] = details
                setDataSource(newDataSource)
              }}
              onDuplicate={onFinish}
            />
            <DeleteButton
              onDelete={() => {
                const newDataSource = dataSource.slice(0)
                const index = newDataSource.indexOf(record)
                newDataSource.splice(index, 1)
                setDataSource(newDataSource)
              }}
            />
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <Helmet>
        <title>Car Loan Calculator</title>
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
        initialValues={defaultLoan}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
      />
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </>
  )
}
