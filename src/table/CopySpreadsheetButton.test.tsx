import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopySpreadsheetButton } from './CopySpreadsheetButton'
import { Details, DownPaymentType } from '../components/types'

const record: Details = {
  key: 'test',
  name: 'My House',
  price: 1000000,
  monthly: 3877.73,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: 100000,
  loanPeriodYears: 35,
  interestRate: 2.88,
  loanSize: 900000,
  totalInterest: 529537.49,
  totalLoanCost: 1429537.49,
  lifetimeCost: 1529537.49,
  monthlyInterest: 1260.8,
}

test('copies the row as tab-separated field/value rows', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(<CopySpreadsheetButton record={record} />)
  await userEvent.click(
    screen.getByRole('button', { name: 'Copy to spreadsheet' })
  )

  const tsv = writeText.mock.calls[0][0]
  const lines = tsv.split('\n')
  // each field is a two-column row separated by a tab
  expect(lines).toContain('Name\tMy House')
  expect(lines).toContain('Price\t1,000,000')
  expect(lines).toContain('Monthly\t3,877.73')
  expect(lines).toContain('Total Interest\t529,537.49')
  // sections are separated by a blank row
  expect(tsv).toContain('\n\n')
})
