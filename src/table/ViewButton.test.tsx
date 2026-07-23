import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ViewButton } from './ViewButton'
import { Details, DownPaymentType } from '../components/types'

const record: Details = {
  key: 'test',
  name: 'My Car',
  price: 260000,
  sqft: 1000,
  pricePerSqft: 260,
  monthly: 2654.17,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: 26000,
  loanPeriodYears: 9,
  interestRate: 2.5,
  loanSize: 234000,
  totalInterest: 52650,
  totalLoanCost: 286650,
  lifetimeCost: 312650,
  monthlyInterest: 487.5,
}

test('view dialog lists every field and copies them', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(<ViewButton record={record} kind="flat" title="Car Loan Calculator" />)
  await userEvent.click(screen.getByRole('button', { name: 'View' }))

  // every field is displayed
  for (const label of [
    'Name',
    'Price',
    'Sqft',
    'Down Payment',
    'Loan Period',
    'Interest Rate',
    'Monthly',
    'Loan Size',
    'Monthly Interest',
    'Total Interest',
    'Total Loan Cost',
    'Lifetime Cost',
  ]) {
    expect(screen.getByText(label)).toBeInTheDocument()
  }

  await userEvent.click(screen.getByRole('button', { name: /copy/i }))
  const text = writeText.mock.calls[0][0]
  expect(text.startsWith('Car Loan Calculator\n---\n')).toBe(true)
  expect(text).toContain('Name: My Car')
  expect(text).toContain('Price: 260,000')
  expect(text).toContain('Sqft: 1,000 (260 / sqft)')
  expect(text).toContain('Down Payment: 10% (26,000)')
  expect(text).toContain('Loan Period: 9 years')
  expect(text).toContain('Interest Rate: 2.5%')
  expect(text).toContain('Monthly: 2,654.17')
  expect(text).toContain('Loan Size: 234,000')
  expect(text).toContain('Monthly Interest: 487.5')
  expect(text).toContain(
    '---\nTotal Interest: 52,650\nTotal Loan Cost: 286,650\nLifetime Cost: 312,650'
  )
})
