import { fmtMoney } from '@/components/loanForms'
import { Details } from '@/components/types'

// Estimated upfront costs of buying a home in Malaysia. Rates and tiers per
// https://www.stashaway.my/r/complete-guide-first-time-home-buyer-buying-house-in-malaysia
export const MALAYSIA_SOURCE_URL =
  'https://www.stashaway.my/r/complete-guide-first-time-home-buyer-buying-house-in-malaysia'

interface Band {
  // size of this tier (Infinity for the final, open-ended band)
  size: number
  rate: number
}

// applies each band's rate to its slice of the amount
const tiered = (amount: number, bands: Band[]): number => {
  let remaining = amount
  let fee = 0
  for (const band of bands) {
    if (remaining <= 0) break
    const portion = Math.min(remaining, band.size)
    fee += portion * band.rate
    remaining -= portion
  }
  return fee
}

// Stamp duty (Memorandum of Transfer) — tiered on the property price
const STAMP_DUTY_MOT_BANDS: Band[] = [
  { size: 100_000, rate: 0.01 },
  { size: 400_000, rate: 0.02 },
  { size: 500_000, rate: 0.03 },
  { size: Infinity, rate: 0.04 },
]

// Legal fees scale (MOT and loan agreement share it) with a RM500 minimum
const LEGAL_FEE_BANDS: Band[] = [
  { size: 500_000, rate: 0.01 },
  { size: 500_000, rate: 0.008 },
  { size: 2_000_000, rate: 0.007 },
  { size: 2_000_000, rate: 0.006 },
  { size: 2_500_000, rate: 0.005 },
]
const LEGAL_FEE_MIN = 500

// Valuation fees — tiered on the property price, per BOVAEA's Seventh
// Schedule (Rule 48). Above RM15m is negotiable; we extend the 0.15% band.
const VALUATION_BANDS: Band[] = [
  { size: 100_000, rate: 0.0025 },
  { size: 1_900_000, rate: 0.002 },
  { size: 5_000_000, rate: 0.00167 },
  { size: Infinity, rate: 0.0015 },
]

// flat / range-based fees; ranges use their midpoint as an estimate
const SPA_STAMPING = 100 // "not more than RM100"
const SPA_DISBURSEMENT = 1250 // RM1,000 – RM1,500
const LOAN_DISBURSEMENT = 1250 // RM1,000 – RM1,500
const BANK_PROCESSING = 175 // RM50 – RM300
const SST_RATE = 0.06 // government tax on legal services

export interface MalaysiaFees {
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
  // sum of every fee above (excludes the down payment)
  totalFees: number
  // totalFees + down payment
  initialCosts: number
}

// mortgage insurance (MRTA) premium rate applied when none is supplied. The
// premium is financed into the loan, so it is part of the loan size — not
// the upfront costs. See calculateMalaysiaHomeLoan.
export const DEFAULT_MORTGAGE_INSURANCE_RATE = 3

export const calculateMalaysiaFees = (
  price: number,
  loanAmount: number,
  downPayment: number
): MalaysiaFees => {
  const stampDutyMOT = tiered(price, STAMP_DUTY_MOT_BANDS)
  const legalFeesMOT = Math.max(tiered(price, LEGAL_FEE_BANDS), LEGAL_FEE_MIN)
  const stampDutyLoan = loanAmount * 0.005
  const legalFeesLoan = Math.max(
    tiered(loanAmount, LEGAL_FEE_BANDS),
    LEGAL_FEE_MIN
  )
  const valuationFees = tiered(price, VALUATION_BANDS)

  // SST is charged on the legal professional fees and disbursements
  const lawyerFees =
    legalFeesMOT + legalFeesLoan + SPA_DISBURSEMENT + LOAN_DISBURSEMENT
  const govTax = lawyerFees * SST_RATE

  const fees = {
    stampDutyMOT,
    legalFeesMOT,
    stampDutyLoan,
    legalFeesLoan,
    spaStamping: SPA_STAMPING,
    spaDisbursement: SPA_DISBURSEMENT,
    loanDisbursement: LOAN_DISBURSEMENT,
    valuationFees,
    govTax,
    bankProcessingFee: BANK_PROCESSING,
  }

  const totalFees = Object.values(fees).reduce((sum, fee) => sum + fee, 0)
  const initialCosts = totalFees + downPayment

  return { ...fees, totalFees, initialCosts }
}

// label, value and a plain-language note on how each fee was derived; drives
// the form preview tooltips, the view dialog, compare, and copy text.
// variant marks the group subtotal and the grand total for emphasis.
export interface MalaysiaFeeItem {
  label: string
  value: number
  tooltip: string
  variant?: 'subtotal' | 'total'
}

// two groups — the fees (with a subtotal) then the down payment — summing to
// the estimated total initial costs
export const malaysiaFeeItems = (record: Details): MalaysiaFeeItem[] => {
  if (record.initialCosts === undefined) {
    return []
  }
  return [
    {
      label: 'Stamp Duty (MOT)',
      value: record.stampDutyMOT ?? 0,
      tooltip:
        'Memorandum of Transfer stamp duty on the property price: 1% of the first RM100k, 2% up to RM500k, 3% up to RM1m, 4% above.',
    },
    {
      label: 'Legal Fees (MOT)',
      value: record.legalFeesMOT ?? 0,
      tooltip:
        'On the property price: 1% first RM500k, 0.8% next RM500k, 0.7% next RM2m, 0.6% next RM2m, 0.5% next RM2.5m (min RM500).',
    },
    {
      label: 'Stamp Duty (Loan)',
      value: record.stampDutyLoan ?? 0,
      tooltip: '0.5% of the loan amount.',
    },
    {
      label: 'Legal Fees (Loan)',
      value: record.legalFeesLoan ?? 0,
      tooltip:
        'Same scale as the MOT legal fees but on the loan amount: 1% first RM500k, 0.8% next RM500k, … (min RM500).',
    },
    {
      label: 'SPA Stamping',
      value: record.spaStamping ?? 0,
      tooltip: 'Stamping of the Sale & Purchase Agreement (up to RM100).',
    },
    {
      label: 'SPA Disbursement',
      value: record.spaDisbursement ?? 0,
      tooltip:
        'SPA legal disbursement — estimated midpoint of RM1,000–RM1,500.',
    },
    {
      label: 'Loan Disbursement',
      value: record.loanDisbursement ?? 0,
      tooltip:
        'Loan facility agreement legal disbursement — estimated midpoint of RM1,000–RM1,500.',
    },
    {
      label: 'Valuation Fees',
      value: record.valuationFees ?? 0,
      tooltip:
        'Buyer-paid property valuation, regulated by BOVAEA (Seventh Schedule, Rule 48): 0.25% of the first RM100k, 0.20% up to RM2m, 0.167% up to RM7m, 0.15% up to RM15m, negotiable above.',
    },
    {
      label: 'Government Tax (SST)',
      value: record.govTax ?? 0,
      tooltip:
        '6% SST on total lawyer fees (MOT + loan legal fees and disbursements).',
    },
    {
      label: 'Bank Processing Fee',
      value: record.bankProcessingFee ?? 0,
      tooltip: 'Bank loan processing fee — estimated (RM50–RM300).',
    },
    {
      label: 'Total Fees',
      value: record.totalFees ?? 0,
      tooltip: 'Sum of every fee above (excludes the down payment).',
      variant: 'subtotal',
    },
    {
      label: 'Down Payment',
      value: record.downPaymentFixed,
      tooltip: 'The down payment paid upfront at purchase.',
      variant: 'subtotal',
    },
    {
      label: 'Estimated Total Initial Costs',
      value: record.initialCosts,
      tooltip:
        'Total fees plus the down payment — the estimated cash needed upfront.',
      variant: 'total',
    },
  ]
}

// copy-text lines for the Malaysian fees, matching the display order
export const malaysiaCopyLines = (record: Details): string[] =>
  malaysiaFeeItems(record).map(
    (item) => `${item.label}: ${fmtMoney(item.value)}`
  )
