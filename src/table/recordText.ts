import { downPaymentText, fmtMoney as money } from '@/components/loanForms'
import { Details } from '@/components/types'

// every field and computed value of a saved row, grouped into the terms,
// the repayment, and the lifetime totals; drives the view dialog summary,
// its copy button, and the action-column copy button
export const detailSections = (record: Details): [string, string][][] => [
  [
    ...(record.name ? ([['Name', record.name]] as [string, string][]) : []),
    ['Price', money(record.price)],
    ...(record.sqft
      ? ([
          [
            'Sqft',
            `${money(record.sqft)} (${money(
              record.pricePerSqft ?? record.price / record.sqft
            )} / sqft)`,
          ],
        ] as [string, string][])
      : []),
    ['Down Payment', downPaymentText(record, record.downPaymentFixed)],
    ['Loan Period', `${record.loanPeriodYears} years`],
    ['Interest Rate', `${record.interestRate}%`],
  ],
  [
    ['Monthly', money(record.monthly)],
    ['Loan Size', money(record.loanSize)],
    ['Monthly Interest', money(record.monthlyInterest)],
  ],
  [
    ['Total Interest', money(record.totalInterest)],
    ['Total Loan Cost', money(record.totalLoanCost)],
    ['Lifetime Cost', money(record.lifetimeCost)],
  ],
]

export const recordToClipboardText = (record: Details): string =>
  detailSections(record)
    .map((section) =>
      section.map(([label, value]) => `${label}: ${value}`).join('\n')
    )
    .join('\n---\n')
