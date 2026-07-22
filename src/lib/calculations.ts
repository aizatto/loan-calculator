import {
  BudgetFormDTO,
  Details,
  DownPaymentType,
  LoanFormDTO,
} from '@/components/types'

const key = () => (Math.random() + 1).toString(36).substring(7)

export type AmortizationKind = 'flat' | 'amortized'

export interface AmortizationRow {
  key: string
  month: number
  year: string
  interestPaid: number
  principlePaid: number
  totalInterestPaid: number
  totalPrinciplePaid: number
  totalPaid: number
  remainingInterest: number
  remainingPrinciple: number
  remainingLifetimeCost: number
}

// Monthly repayment schedule for a saved loan.
// - flat: interest allocated by the Rule of 78 (sum of digits), as used for
//   flat-rate car loans
// - amortized: declining-balance interest, matching the home loan formula
export const amortizationSchedule = (
  record: Details,
  kind: AmortizationKind
): AmortizationRow[] => {
  const months = record.loanPeriodYears * 12
  const monthlyRate = record.interestRate / 100 / 12
  const sumOfMonths = (months * (months + 1)) / 2

  const rows: AmortizationRow[] = []

  let totalPrinciplePaid = 0
  let totalInterestPaid = 0
  let balance = record.loanSize

  for (let i = 0; i < months; i++) {
    const interestPaid =
      kind === 'flat'
        ? ((months - i) / sumOfMonths) * record.totalInterest
        : balance * monthlyRate
    const principlePaid = record.monthly - interestPaid

    totalPrinciplePaid += principlePaid
    totalInterestPaid += interestPaid
    balance -= principlePaid

    rows.push({
      key: `${record.key}:${i}`,
      year: `Y${Math.floor(i / 12) + 1}M${(i % 12) + 1}`,
      month: i + 1,
      interestPaid,
      principlePaid,
      totalInterestPaid,
      totalPrinciplePaid,
      totalPaid: (i + 1) * record.monthly,
      remainingInterest: record.totalInterest - totalInterestPaid,
      remainingPrinciple: record.loanSize - totalPrinciplePaid,
      // the down payment is paid upfront, so only the loan repayments
      // remain over the term; this reaches zero at the final month
      remainingLifetimeCost: record.totalLoanCost - (i + 1) * record.monthly,
    })
  }

  return rows
}

// Car loans use flat (simple) interest on the borrowed principal:
// totalLoanCost = loanSize * (1 + rate * years)
export const calculateCarLoan = (dto: LoanFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    dto.downPaymentFixed = dto.price * (dto.downPaymentPercentage / 100)
  }

  const loanSize = dto.price - dto.downPaymentFixed
  const totalInterest =
    (dto.interestRate / 100) * loanSize * dto.loanPeriodYears
  const totalLoanCost = loanSize + totalInterest
  const lifetimeCost = totalLoanCost + dto.downPaymentFixed
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)
  const monthly = totalLoanCost / (dto.loanPeriodYears * 12)

  return {
    key: key(),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    monthly,
  }
}

// Inverse of calculateCarLoan: from a monthly budget, back out the price
export const calculateCarBudget = (dto: BudgetFormDTO): Details => {
  const totalLoanCost = dto.monthly * dto.loanPeriodYears * 12

  // totalLoanCost = loanSize * (1 + rate * years)
  const loanSize =
    totalLoanCost / (1 + (dto.interestRate / 100) * dto.loanPeriodYears)
  const totalInterest = totalLoanCost - loanSize

  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    // down payment is a percentage of the price: dp = pct * (loanSize + dp)
    dto.downPaymentFixed =
      loanSize * (1 / (1 - dto.downPaymentPercentage / 100)) - loanSize
  }

  const price = loanSize + dto.downPaymentFixed
  const lifetimeCost = totalLoanCost + dto.downPaymentFixed
  const monthlyInterest = totalInterest / (dto.loanPeriodYears * 12)

  return {
    key: key(),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    price,
  }
}

// Home loans amortize: standard annuity formula
// https://en.wikipedia.org/wiki/Mortgage_calculator
export const calculateHomeLoan = (dto: LoanFormDTO): Details => {
  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    dto.downPaymentFixed = dto.price * (dto.downPaymentPercentage / 100)
  }

  const months = dto.loanPeriodYears * 12
  const rate = dto.interestRate / 100 / 12

  const principle = dto.price - dto.downPaymentFixed
  const monthly = principle * (rate / (1 - Math.pow(1 + rate, -1 * months)))

  const lifetimeCost = monthly * months + dto.downPaymentFixed

  // interest is what the repayments cost beyond the borrowed principle;
  // the down payment is not part of the loan
  const totalInterest = monthly * months - principle
  const totalLoanCost = principle + totalInterest

  const monthlyInterest = totalInterest / months

  return {
    key: key(),
    ...dto,
    loanSize: principle,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    monthly,
    pricePerSqft: dto.sqft ? dto.price / dto.sqft : undefined,
  }
}

// Inverse of calculateHomeLoan: the loan size is the present value of the
// monthly payments
export const calculateHomeBudget = (dto: BudgetFormDTO): Details => {
  const months = dto.loanPeriodYears * 12
  const rate = dto.interestRate / 100 / 12

  const totalLoanCost = dto.monthly * months

  const loanSize = (dto.monthly * (1 - Math.pow(1 + rate, -1 * months))) / rate
  const totalInterest = totalLoanCost - loanSize

  if (dto.downPaymentType === DownPaymentType.PERCENTAGE) {
    dto.downPaymentFixed =
      loanSize * (1 / (1 - dto.downPaymentPercentage / 100)) - loanSize
  }

  const price = loanSize + dto.downPaymentFixed
  const lifetimeCost = totalLoanCost + dto.downPaymentFixed
  const monthlyInterest = totalInterest / months

  return {
    key: key(),
    ...dto,
    loanSize,
    totalInterest,
    totalLoanCost,
    lifetimeCost,
    monthlyInterest,
    price,
  }
}
