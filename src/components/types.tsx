export enum DownPaymentType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

export type DTOShort = {
  name?: string
  monthly: number
  downPaymentType: DownPaymentType
  downPaymentFixed: number
  downPaymentPercentage: number
  loanPeriodYears: number
  interestRate: number
}

export type DTOLong = DTOShort & {
  key: string
  loanSize: number
  totalInterest: number
  totalLoanCost: number
  lifetimeCost: number
  monthlyInterest: number
  price: number
}