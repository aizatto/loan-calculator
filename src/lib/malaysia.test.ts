import { calculateMalaysiaFees } from './malaysia'
import { calculateMalaysiaHomeLoan } from './calculations'
import { DownPaymentType } from '@/components/types'

const closeTo = (actual: number, expected: number) =>
  expect(actual).toBeCloseTo(expected, 4)

describe('calculateMalaysiaFees', () => {
  // RM1,000,000 property, RM900,000 loan, RM100,000 down payment, 3% MRTA
  const fees = calculateMalaysiaFees(1_000_000, 900_000, 100_000, 3)

  test('stamp duty MOT is tiered on the property price', () => {
    // 1%*100k + 2%*400k + 3%*500k = 1000 + 8000 + 15000
    closeTo(fees.stampDutyMOT, 24_000)
  })

  test('legal fees MOT are tiered on the property price', () => {
    // 1%*500k + 0.8%*500k = 5000 + 4000
    closeTo(fees.legalFeesMOT, 9_000)
  })

  test('loan stamp duty is 0.5% of the loan', () => {
    closeTo(fees.stampDutyLoan, 4_500)
  })

  test('legal fees loan are tiered on the loan amount', () => {
    // 1%*500k + 0.8%*400k = 5000 + 3200
    closeTo(fees.legalFeesLoan, 8_200)
  })

  test('valuation fees are tiered on the property price', () => {
    // 0.25%*100k + 0.2%*900k = 250 + 1800
    closeTo(fees.valuationFees, 2_050)
  })

  test('government tax is 6% of total lawyer fees', () => {
    // 6% of (9000 + 8200 + 1250 + 1250)
    closeTo(fees.govTax, 0.06 * (9_000 + 8_200 + 1_250 + 1_250))
  })

  test('flat and range fees use documented estimates', () => {
    expect(fees.spaStamping).toBe(100)
    expect(fees.spaDisbursement).toBe(1_250)
    expect(fees.loanDisbursement).toBe(1_250)
    expect(fees.bankProcessingFee).toBe(175)
  })

  test('mortgage insurance is the rate applied to the loan', () => {
    // 3% of RM900,000
    closeTo(fees.mortgageInsurance, 27_000)
    // and honours a custom rate
    const custom = calculateMalaysiaFees(1_000_000, 900_000, 100_000, 5)
    closeTo(custom.mortgageInsurance, 45_000)
    // defaults to 3% when omitted
    const defaulted = calculateMalaysiaFees(1_000_000, 900_000, 100_000)
    closeTo(defaulted.mortgageInsurance, 27_000)
  })

  test('total fees sum every fee but not the down payment', () => {
    const expectedFees =
      24_000 +
      9_000 +
      4_500 +
      8_200 +
      100 +
      1_250 +
      1_250 +
      2_050 +
      fees.govTax +
      175 +
      27_000
    closeTo(fees.totalFees, expectedFees)
  })

  test('initial costs are the total fees plus the down payment', () => {
    closeTo(fees.initialCosts, fees.totalFees + 100_000)
  })

  test('legal fees never fall below the RM500 minimum', () => {
    const small = calculateMalaysiaFees(30_000, 20_000, 10_000)
    expect(small.legalFeesMOT).toBe(500)
    expect(small.legalFeesLoan).toBe(500)
  })
})

test('calculateMalaysiaHomeLoan keeps the mortgage fields and adds the fees', () => {
  const details = calculateMalaysiaHomeLoan({
    price: 1_000_000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 35,
    interestRate: 3.8,
  })
  closeTo(details.loanSize, 900_000)
  closeTo(details.stampDutyMOT!, 24_000)
  expect(details.initialCosts).toBeGreaterThan(details.downPaymentFixed)
})
