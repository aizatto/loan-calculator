import { LoanForm } from '../components/LoanForm'
import { toLoanDTO, useLoanForm } from '../components/loanForms'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { calculateMalaysiaHomeLoan as calculateLoan } from '@/lib/calculations'
import { MALAYSIA_SOURCE_URL } from '@/lib/malaysia'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CopyRowButton } from '../table/CopyRowButton'
import { DeleteButton } from '../table/DeleteButton'
import { EditButton } from '../table/EditButton'
import { LoadButton } from '../table/LoadButton'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'
import { ViewButton } from '../table/ViewButton'

// standard mortgage columns plus a summary of the estimated upfront costs
const columns: LoanTableColumnKey[] = [
  'name',
  'price',
  'pricePerSqft',
  'monthly',
  'downPaymentFixed',
  'loanPeriodYears',
  'interestRate',
  'loanSize',
  'lifetimeCost',
  'initialCosts',
]

// compare shows the full Malaysian fee breakdown
const compareColumns: LoanTableColumnKey[] = [
  ...columns.slice(0, -1),
  'totalInterest',
  'stampDutyMOT',
  'legalFeesMOT',
  'stampDutyLoan',
  'legalFeesLoan',
  'spaStamping',
  'spaDisbursement',
  'loanDisbursement',
  'valuationFees',
  'govTax',
  'bankProcessingFee',
  'mortgageInsurance',
  'totalFees',
  'downPaymentFixed',
  'initialCosts',
]

export const MalaysiaHomePage: React.FC = () => {
  const [values, setValues] = useLocalStorage<Details[]>('malaysia-home-loan', [
    calculateLoan({
      price: 1000000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 100000,
      loanPeriodYears: 35,
      interestRate: 3.8,
      mortgageInsuranceRate: 3,
    }),
  ])

  const form = useLoanForm(values[0])

  const onFinish = (dto: LoanFormDTO) => {
    const newValues = values.slice(0)
    newValues.unshift(calculateLoan(dto))
    setValues(newValues)
  }

  return (
    <>
      {/* React 19 hoists title/link tags into <head> */}
      <title>Malaysia Home Loan Calculator</title>
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
      <h1>Malaysia Home Loan Calculator</h1>
      <p className="text-sm text-muted-foreground">
        Estimates the upfront costs of buying a home in Malaysia — stamp duties,
        legal fees, disbursements, valuation, SST and processing fees. Rates per{' '}
        <a
          className="underline underline-offset-4 hover:text-primary"
          href={MALAYSIA_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          StashAway's first-time home buyer guide
        </a>
        .
      </p>
      <LoanForm
        form={form}
        initialValues={values[0]}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
        showCopy
        showSqft
        showMortgageInsurance
      />
      <LoanTable
        columns={columns}
        compareColumns={compareColumns}
        dataSource={values}
        actions={(record) => (
          <>
            <ViewButton record={record} kind="amortized" />
            <CopyRowButton record={record} />
            <LoadButton onLoad={() => form.reset(toLoanDTO(record))} />
            <EditButton
              record={record}
              showSqft
              showMortgageInsurance
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
