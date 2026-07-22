import { BudgetForm } from '../components/BudgetForm'
import { toBudgetDTO, useBudgetForm } from '../components/loanForms'
import { BudgetFormDTO, Details, DownPaymentType } from '../components/types'
import { calculateCarBudget as calculateDTO } from '@/lib/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { LoadButton } from '../table/LoadButton'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'

export const CarBudgetPage: React.FC = () => {
  const [values, setValues] = useLocalStorage<Details[]>('car-budget', [
    calculateDTO({
      monthly: 2000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentFixed: 26000,
      downPaymentPercentage: 10,
      loanPeriodYears: 9,
      interestRate: 2.5,
    }),
  ])

  const form = useBudgetForm(values[0])

  const onFinish = (dto: BudgetFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateDTO(dto))
    setValues(newValues)
  }

  const columns: LoanTableColumnKey[] = [
    'name',
    'monthly',
    'price',
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
      <title>Car Budget Calculator</title>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${import.meta.env.BASE_URL}favicons/car/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${import.meta.env.BASE_URL}favicons/car/favicon-32x32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${import.meta.env.BASE_URL}favicons/car/favicon-16x16.png`}
      />
      <h1>Reverse Car Loan Calculator</h1>
      <p>Calculate what car you can afford based on your monthly budget</p>
      <BudgetForm
        form={form}
        initialValues={values[0]}
        onChange={(values) => {
          return calculateDTO(values)
        }}
        onFinish={onFinish}
      />
      <LoanTable
        columns={columns}
        dataSource={values}
        actions={(record) => (
          <LoadButton onLoad={() => form.reset(toBudgetDTO(record))} />
        )}
      />
    </>
  )
}
