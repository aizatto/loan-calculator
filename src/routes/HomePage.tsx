import { LoanForm } from '../components/LoanForm'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'

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

  const columns: LoanTableColumnKey[] = [
    'name',
    'price',
    'monthly',
    'downPaymentFixed',
    'loanPeriodYears',
    'interestRate',
    'loanSize',
    'totalInterest',
    'totalLoanCost',
    'lifetimeCost',
    'monthlyInterest',
  ]

  return (
    <>
      {/* React 19 hoists title/link tags into <head> */}
      <title>Home Loan Calculator</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${import.meta.env.BASE_URL}favicons/home/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${import.meta.env.BASE_URL}favicons/home/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${import.meta.env.BASE_URL}favicons/home/favicon-16x16.png`}
      />
      <h1>Home Loan Calculator</h1>
      <LoanForm
        initialValues={values[0]}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
        showCopy
      />
      <LoanTable columns={columns} dataSource={values} />
    </>
  )
}
