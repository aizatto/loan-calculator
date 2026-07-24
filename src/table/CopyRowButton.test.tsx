import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CopyRowButton } from './CopyRowButton'
import { Details, DownPaymentType } from '../components/types'

const record: Details = {
  key: 'test',
  name: 'My House',
  price: 1000000,
  sqft: 1250,
  pricePerSqft: 800,
  monthly: 3403.66,
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

test('copies the row fields as text', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(<CopyRowButton record={record} />)
  await userEvent.click(screen.getByRole('button', { name: 'Copy' }))

  const text = writeText.mock.calls[0][0]
  expect(text).toContain('Name: My House')
  expect(text).toContain('Price: 1,000,000')
  expect(text).toContain('Sqft: 1,250 (800 / sqft)')
  expect(text).toContain('Down Payment: 10% (100,000)')
  expect(text).toContain('---\nMonthly: 3,403.66')
  expect(text).toContain('---\nTotal Interest: 529,537.49')
})
