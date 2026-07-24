import { BudgetForm } from '../components/BudgetForm'
import { toBudgetDTO, useBudgetForm } from '../components/loanForms'
import { BudgetFormDTO, Details, DownPaymentType } from '../components/types'
import { calculateHomeBudget as calculateMortage } from '@/lib/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CopyRowButton } from '../table/CopyRowButton'
import { DeleteButton } from '../table/DeleteButton'
import { EditBudgetButton } from '../table/EditBudgetButton'
import { LoadButton } from '../table/LoadButton'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'
import { ViewButton } from '../table/ViewButton'

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

  const form = useBudgetForm(values[0])

  const onFinish = (dto: BudgetFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateMortage(dto))
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
      <title>Home Budget Calculator</title>
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
      <h1>Reverse Home Loan Calculator</h1>
      <p>Calculate what home you can afford based on your monthly budget</p>
      <BudgetForm
        form={form}
        initialValues={values[0]}
        onChange={(values) => {
          return calculateMortage(values)
        }}
        onFinish={onFinish}
      />
      <LoanTable
        columns={columns}
        dataSource={values}
        actions={(record) => (
          <>
            <ViewButton record={record} kind="amortized" />
            <CopyRowButton record={record} />
            <LoadButton onLoad={() => form.reset(toBudgetDTO(record))} />
            <EditBudgetButton
              record={record}
              onChange={(values) => {
                return calculateMortage(values)
              }}
              onUpdate={(dto) => {
                const details = calculateMortage(dto)
                const newValues = values.slice(0)
                const index = newValues.indexOf(record)
                newValues[index] = details
                setValues(newValues)
              }}
              onDuplicate={onFinish}
            />
            <DeleteButton
              onDelete={() => {
                const newValues = values.slice(0)
                const index = newValues.indexOf(record)
                newValues.splice(index, 1)
                setValues(newValues)
              }}
            />
          </>
        )}
      />
    </>
  )
}
