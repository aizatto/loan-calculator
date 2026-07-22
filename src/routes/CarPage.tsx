import { LoanForm } from '../components/LoanForm'
import { toLoanDTO, useLoanForm } from '../components/loanForms'
import { Details, DownPaymentType, LoanFormDTO } from '../components/types'
import { calculateCarLoan as calculateLoan } from '@/lib/calculations'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DeleteButton } from '../table/DeleteButton'
import { EditButton } from '../table/EditButton'
import { LoadButton } from '../table/LoadButton'
import { LoanTable, LoanTableColumnKey } from '../table/LoanTable'
import { ViewButton } from '../table/ViewButton'

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

  const form = useLoanForm(defaultLoan)

  const onFinish = (dto: LoanFormDTO) => {
    const newDataSource = dataSource.slice(0)
    newDataSource.unshift(calculateLoan(dto))
    setDataSource(newDataSource)
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
  ]

  const actions = (record: Details) => (
    <>
      <ViewButton record={record} kind="flat" />
      <LoadButton onLoad={() => form.reset(toLoanDTO(record))} />
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
    </>
  )

  return (
    <>
      {/* React 19 hoists title/link tags into <head> */}
      <title>Car Loan Calculator</title>
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
      <h1>Car Loan Calculator</h1>
      <LoanForm
        form={form}
        initialValues={defaultLoan}
        onChange={(values) => {
          return calculateLoan(values)
        }}
        onFinish={onFinish}
        showCopy
      />
      <LoanTable
        columns={columns}
        dataSource={dataSource}
        sortable
        actions={actions}
      />
    </>
  )
}
