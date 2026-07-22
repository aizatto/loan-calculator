import {
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
})
