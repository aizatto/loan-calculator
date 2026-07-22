import {
  amortizationSchedule,
  calculateCarBudget,
  calculateCarLoan,
  calculateHomeBudget,
  calculateHomeLoan,
} from './calculations'
import { DownPaymentType } from '@/components/types'

const closeTo = (actual: number, expected: number) =>
  expect(actual).toBeCloseTo(expected, 6)

describe('car loan (flat rate)', () => {
  const loan = calculateCarLoan({
    price: 260000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 9,
    interestRate: 2.5,
  })

  test('forward values', () => {
    closeTo(loan.downPaymentFixed, 26000)
    closeTo(loan.loanSize, 234000)
    // flat interest on the principal
    closeTo(loan.totalInterest, 234000 * 0.025 * 9)
    closeTo(loan.totalLoanCost, loan.loanSize + loan.totalInterest)
    closeTo(loan.lifetimeCost, loan.price + loan.totalInterest)
    closeTo(loan.monthly, loan.totalLoanCost / (9 * 12))
  })

  test('reverse (fixed down payment) round-trips', () => {
    const budget = calculateCarBudget({
      monthly: loan.monthly,
      downPaymentType: DownPaymentType.FIXED,
      downPaymentFixed: 26000,
      downPaymentPercentage: 0,
      loanPeriodYears: 9,
      interestRate: 2.5,
    })
    closeTo(budget.price, 260000)
    closeTo(budget.loanSize, loan.loanSize)
    closeTo(budget.totalInterest, loan.totalInterest)
    closeTo(budget.lifetimeCost, loan.lifetimeCost)
  })

  test('reverse (percentage down payment) round-trips', () => {
    const budget = calculateCarBudget({
      monthly: loan.monthly,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 0,
      loanPeriodYears: 9,
      interestRate: 2.5,
    })
    closeTo(budget.price, 260000)
    closeTo(budget.downPaymentFixed, 26000)
    closeTo(budget.totalInterest, loan.totalInterest)
  })
})

describe('home loan (amortized)', () => {
  const loan = calculateHomeLoan({
    price: 1000000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 35,
    interestRate: 2.88,
  })

  test('forward values', () => {
    closeTo(loan.downPaymentFixed, 100000)
    closeTo(loan.loanSize, 900000)
    // standard annuity payment on the principal
    const r = 0.0288 / 12
    closeTo(loan.monthly, 900000 * (r / (1 - Math.pow(1 + r, -420))))
    // interest excludes the down payment
    closeTo(loan.totalInterest, loan.monthly * 420 - 900000)
    closeTo(loan.totalLoanCost, loan.monthly * 420)
    closeTo(loan.lifetimeCost, loan.monthly * 420 + 100000)
  })

  test('reverse (fixed down payment) round-trips', () => {
    const budget = calculateHomeBudget({
      monthly: loan.monthly,
      downPaymentType: DownPaymentType.FIXED,
      downPaymentFixed: 100000,
      downPaymentPercentage: 0,
      loanPeriodYears: 35,
      interestRate: 2.88,
    })
    closeTo(budget.price, 1000000)
    closeTo(budget.loanSize, 900000)
    closeTo(budget.totalInterest, loan.totalInterest)
    closeTo(budget.lifetimeCost, loan.lifetimeCost)
  })

  test('reverse (percentage down payment) round-trips', () => {
    const budget = calculateHomeBudget({
      monthly: loan.monthly,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 0,
      loanPeriodYears: 35,
      interestRate: 2.88,
    })
    closeTo(budget.price, 1000000)
    closeTo(budget.downPaymentFixed, 100000)
    closeTo(budget.totalInterest, loan.totalInterest)
  })

  test('price per sqft is computed when sqft is provided', () => {
    const withSqft = calculateHomeLoan({
      price: 1000000,
      sqft: 1250,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 0,
      loanPeriodYears: 35,
      interestRate: 2.88,
    })
    closeTo(withSqft.pricePerSqft!, 800)
    // and stays absent without sqft
    expect(loan.pricePerSqft).toBeUndefined()
  })
})

describe('amortization schedule', () => {
  const carLoan = calculateCarLoan({
    price: 260000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 9,
    interestRate: 2.5,
  })
  const homeLoan = calculateHomeLoan({
    price: 1000000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 35,
    interestRate: 2.88,
  })

  test('flat schedule pays off interest and principal exactly', () => {
    const rows = amortizationSchedule(carLoan, 'flat')
    expect(rows).toHaveLength(9 * 12)
    const last = rows[rows.length - 1]
    expect(last.totalInterestPaid).toBeCloseTo(carLoan.totalInterest, 6)
    expect(last.totalPrinciplePaid).toBeCloseTo(carLoan.loanSize, 6)
    expect(last.remainingPrinciple).toBeCloseTo(0, 6)
    expect(last.remainingInterest).toBeCloseTo(0, 6)
    // the down payment is paid upfront, not owed across the term
    expect(last.remainingLifetimeCost).toBeCloseTo(0, 6)
    expect(rows[0].remainingLifetimeCost).toBeCloseTo(
      carLoan.totalLoanCost - carLoan.monthly,
      6
    )
  })

  test('amortized schedule pays off interest and principal exactly', () => {
    const rows = amortizationSchedule(homeLoan, 'amortized')
    expect(rows).toHaveLength(35 * 12)
    const last = rows[rows.length - 1]
    expect(last.totalInterestPaid).toBeCloseTo(homeLoan.totalInterest, 4)
    expect(last.totalPrinciplePaid).toBeCloseTo(homeLoan.loanSize, 4)
    expect(last.remainingPrinciple).toBeCloseTo(0, 4)
    expect(last.remainingLifetimeCost).toBeCloseTo(0, 4)
    // amortized interest is front-loaded: first month strictly above average
    expect(rows[0].interestPaid).toBeGreaterThan(homeLoan.monthlyInterest)
    expect(rows[0].interestPaid).toBeCloseTo(
      homeLoan.loanSize * (0.0288 / 12),
      6
    )
  })
})
