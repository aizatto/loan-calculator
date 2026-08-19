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
  sqft?: number
  // mortgage insurance (MRTA) premium: a % of the loan amount, or a fixed sum
  mortgageInsuranceType?: DownPaymentType
  mortgageInsuranceRate?: number
  mortgageInsuranceFixed?: number
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
    pricePerSqft?: number
  } & Partial<MalaysiaFeeFields>

// Malaysian home-buying costs; only populated by the Malaysia calculator
export type MalaysiaFeeFields = {
  stampDutyMOT: number
  legalFeesMOT: number
  stampDutyLoan: number
  legalFeesLoan: number
  spaStamping: number
  spaDisbursement: number
  loanDisbursement: number
  valuationFees: number
  govTax: number
  bankProcessingFee: number
  mortgageInsurance: number
  totalFees: number
  initialCosts: number
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
