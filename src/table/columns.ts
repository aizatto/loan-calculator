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
  | 'totalPayment'
  | 'lifetimeCost'
  | 'monthlyInterest'
  | 'stampDutyMOT'
  | 'legalFeesMOT'
  | 'stampDutyLoan'
  | 'legalFeesLoan'
  | 'spaStamping'
  | 'spaDisbursement'
  | 'loanDisbursement'
  | 'valuationFees'
  | 'govTax'
  | 'bankProcessingFee'
  | 'additionalInitialCosts'
  | 'mortgageInsurance'
  | 'totalFees'
  | 'initialCosts'
  | 'totalCostOfOwnership'

export interface ColumnDef {
  title: string
  numeric?: boolean
  format?: (record: Details) => string
  // numeric value for compare deltas when the column has no direct field
  value?: (record: Details) => number
}

// numeric value of a column for a record, used by compare deltas
export const columnValue = (
  key: LoanTableColumnKey,
  record: Details
): number => {
  const column = COLUMNS[key]
  return column.value ? column.value(record) : Number(record[key])
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
  // sum of all monthly installments paid to the bank over the full tenure
  totalPayment: {
    title: 'Total Payment (End of Tenure)',
    numeric: true,
    value: (record) => record.monthly * record.loanPeriodYears * 12,
    format: (record) => fmtMoney(record.monthly * record.loanPeriodYears * 12),
  },
  lifetimeCost: { title: 'Lifetime Cost', numeric: true },
  monthlyInterest: { title: 'Monthly Interest', numeric: true },
  stampDutyMOT: { title: 'Stamp Duty (MOT)', numeric: true },
  legalFeesMOT: { title: 'Legal Fees (MOT)', numeric: true },
  stampDutyLoan: { title: 'Stamp Duty (Loan)', numeric: true },
  legalFeesLoan: { title: 'Legal Fees (Loan)', numeric: true },
  spaStamping: { title: 'SPA Stamping', numeric: true },
  spaDisbursement: { title: 'SPA Disbursement', numeric: true },
  loanDisbursement: { title: 'Loan Disbursement', numeric: true },
  valuationFees: { title: 'Valuation Fees', numeric: true },
  govTax: { title: 'Government Tax (SST)', numeric: true },
  bankProcessingFee: { title: 'Bank Processing Fee', numeric: true },
  additionalInitialCosts: { title: 'Additional Initial Costs', numeric: true },
  mortgageInsurance: { title: 'Mortgage Insurance', numeric: true },
  totalFees: { title: 'Total Fees', numeric: true },
  initialCosts: { title: 'Initial Costs', numeric: true },
  totalCostOfOwnership: { title: 'Total Cost of Ownership', numeric: true },
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
