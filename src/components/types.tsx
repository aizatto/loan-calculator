export enum DownPaymentType {
  FIXED = 'fixed',
  PERCENTAGE = 'percentage',
}

type Form = {
  name?: string
  downPaymentType: DownPaymentType
  downPaymentFixed: number
  downPaymentPercentage: number
  loanPeriodYears: number
  interestRate: number
}

export type LoanFormDTO = Form & {
  price: number
}

export type BudgetFormDTO = Form & {
  monthly: number
}

export type Details = BudgetFormDTO &
  LoanFormDTO & {
    key: string
    loanSize: number
    totalInterest: number
    totalLoanCost: number
    lifetimeCost: number
    monthlyInterest: number
  }

// export type LoanDetails = LoanForm & {
//   key: string
//   loanSize: number
//   totalInterest: number
//   totalLoanCost: number
//   lifetimeCost: number
//   monthlyInterest: number
//   monthly: number
// }
