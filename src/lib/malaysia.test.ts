import { calculateMalaysiaFees } from './malaysia'
import { calculateMalaysiaHomeLoan } from './calculations'
import { DownPaymentType } from '@/components/types'

const closeTo = (actual: number, expected: number) =>
  expect(actual).toBeCloseTo(expected, 4)

describe('calculateMalaysiaFees', () => {
  // RM1,000,000 property, RM900,000 loan, RM100,000 down payment
  const fees = calculateMalaysiaFees(1_000_000, 900_000, 100_000)

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
    // RM8m spans four BOVAEA bands
    const big = calculateMalaysiaFees(8_000_000, 7_000_000, 1_000_000)
    // 0.25%*100k + 0.2%*1.9m + 0.167%*5m + 0.15%*1m
    closeTo(big.valuationFees, 250 + 3_800 + 8_350 + 1_500)
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

  test('total fees sum every fee but not the down payment or insurance', () => {
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
      175
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

describe('calculateMalaysiaHomeLoan', () => {
  const details = calculateMalaysiaHomeLoan({
    price: 1_000_000,
    downPaymentType: DownPaymentType.PERCENTAGE,
    downPaymentPercentage: 10,
    downPaymentFixed: 0,
    loanPeriodYears: 35,
    interestRate: 3.8,
    mortgageInsuranceRate: 3,
  })

  test('mortgage insurance is financed into the loan size', () => {
    // (1,000,000 - 100,000) + 3% of 900,000 = 900,000 + 27,000
    closeTo(details.mortgageInsurance!, 27_000)
    closeTo(details.loanSize, 927_000)
  })

  test('a fixed mortgage insurance premium is used as-is', () => {
    const fixed = calculateMalaysiaHomeLoan({
      price: 1_000_000,
      downPaymentType: DownPaymentType.PERCENTAGE,
      downPaymentPercentage: 10,
      downPaymentFixed: 0,
      loanPeriodYears: 35,
      interestRate: 3.8,
      mortgageInsuranceType: DownPaymentType.FIXED,
      mortgageInsuranceFixed: 20_000,
    })
    closeTo(fixed.mortgageInsurance!, 20_000)
    closeTo(fixed.loanSize, 920_000)
  })

  test('the monthly payment amortizes the financed principal', () => {
    const r = 0.038 / 12
    closeTo(details.monthly, 927_000 * (r / (1 - Math.pow(1 + r, -420))))
    closeTo(details.totalInterest, details.monthly * 420 - 927_000)
  })

  test('insurance is not part of the upfront costs', () => {
    // initial costs = total fees + down payment, no insurance
    closeTo(
      details.initialCosts!,
      details.totalFees! + details.downPaymentFixed
    )
  })

  test('fees still track the property price', () => {
    closeTo(details.stampDutyMOT!, 24_000)
  })

  test('total cost of ownership is lifetime cost plus total fees', () => {
    closeTo(
      details.totalCostOfOwnership!,
      details.lifetimeCost + details.totalFees!
    )
  })
})
