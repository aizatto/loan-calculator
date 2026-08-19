import { downPaymentText, fmtMoney as money } from '@/components/loanForms'
import { Details } from '@/components/types'
import { malaysiaFeeItems } from '@/lib/malaysia'

// every field and computed value of a saved row, grouped into the terms,
// the repayment, and the lifetime totals; drives the view dialog summary,
// its copy button, and the action-column copy button
export const detailSections = (record: Details): [string, string][][] => {
  const malaysiaSection = malaysiaFeeItems(record).map(
    (item): [string, string] => [item.label, money(item.value)]
  )
  return [
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
      ...(record.mortgageInsurance !== undefined
        ? ([['Mortgage Insurance', money(record.mortgageInsurance)]] as [
            string,
            string,
          ][])
        : []),
      ['Loan Size', money(record.loanSize)],
      ['Monthly Interest', money(record.monthlyInterest)],
    ],
    [
      ['Total Interest', money(record.totalInterest)],
      ['Total Loan Cost', money(record.totalLoanCost)],
      ['Lifetime Cost', money(record.lifetimeCost)],
    ],
    ...(malaysiaSection.length > 0 ? [malaysiaSection] : []),
    ...(record.totalCostOfOwnership !== undefined
      ? [
          [['Total Cost of Ownership', money(record.totalCostOfOwnership)]] as [
            string,
            string,
          ][],
        ]
      : []),
  ]
}

export const recordToClipboardText = (record: Details): string =>
  detailSections(record)
    .map((section) =>
      section.map(([label, value]) => `${label}: ${value}`).join('\n')
    )
    .join('\n---\n')

// tab-separated field/value rows for pasting into a spreadsheet: each field
// lands in one row across two columns, with a blank row between sections
export const recordToTSV = (record: Details): string =>
  detailSections(record)
    .map((section) =>
      section.map(([label, value]) => `${label}\t${value}`).join('\n')
    )
    .join('\n\n')
