import { fmtMoney } from '@/components/loanForms'
import { Details } from '@/components/types'

export type LoanTableColumnKey =
  | 'name'
  | 'price'
  | 'sqft'
  | 'pricePerSqft'
  | 'monthly'
  | 'downPaymentFixed'
  | 'loanPeriodYears'
  | 'interestRate'
  | 'loanSize'
  | 'totalInterest'
  | 'totalLoanCost'
  | 'lifetimeCost'
  | 'monthlyInterest'

export interface ColumnDef {
  title: string
  numeric?: boolean
  format?: (record: Details) => string
}

export const COLUMNS: Record<LoanTableColumnKey, ColumnDef> = {
  name: { title: 'Name' },
  price: { title: 'Price', numeric: true },
  sqft: { title: 'Sqft', numeric: true },
  pricePerSqft: { title: 'Price / Sqft', numeric: true },
  monthly: { title: 'Monthly', numeric: true },
  downPaymentFixed: { title: 'Down Payment', numeric: true },
  loanPeriodYears: { title: 'Loan Period (Years)' },
  interestRate: {
    title: 'Interest Rate',
    numeric: true,
    format: (record) => `${record.interestRate} %`,
  },
  loanSize: { title: 'Loan Size', numeric: true },
  totalInterest: { title: 'Total Interest', numeric: true },
  totalLoanCost: { title: 'Total Loan Cost', numeric: true },
  lifetimeCost: { title: 'Lifetime Cost', numeric: true },
  monthlyInterest: { title: 'Monthly Interest', numeric: true },
}

export const renderCell = (key: LoanTableColumnKey, record: Details) => {
  const column = COLUMNS[key]
  if (column.format) {
    return column.format(record)
  }
  const value = record[key]
  if (value === undefined || value === null) {
    return ''
  }
  if (column.numeric) {
    return fmtMoney(Number(value))
  }
  return value
}
