import { LoanForm } from '../components/LoanForm'
import { toLoanDTO, useLoanForm } from '../components/loanForms'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { calculateHomeLoan as calculateLoan } from '@/lib/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CopyRowButton } from '../table/CopyRowButton'
import { DeleteButton } from '../table/DeleteButton'
import { EditButton } from '../table/EditButton'
import { LoadButton } from '../table/LoadButton'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'
import { ViewButton } from '../table/ViewButton'

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

  const form = useLoanForm(values[0])

  const onFinish = (dto: LoanFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateLoan(dto))
    setValues(newValues)
  }

  const columns: LoanTableColumnKey[] = [
    'name',
    'price',
    'pricePerSqft',
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
        form={form}
        initialValues={values[0]}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
        showCopy
        showSqft
      />
      <LoanTable
        columns={columns}
        dataSource={values}
        actions={(record) => (
          <>
            <ViewButton record={record} kind="amortized" />
            <CopyRowButton record={record} />
            <LoadButton onLoad={() => form.reset(toLoanDTO(record))} />
            <EditButton
              record={record}
              showSqft
              onChange={(values) => {
                return calculateLoan(values)
              }}
              onUpdate={(dto) => {
                const details = calculateLoan(dto)
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
