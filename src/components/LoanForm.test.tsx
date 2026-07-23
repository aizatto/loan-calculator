import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoanForm } from './LoanForm'
import { Details, DownPaymentType, LoanFormDTO } from './types'

const calculate = (dto: LoanFormDTO): Details => ({
  key: 'test',
  monthly: 1000,
  ...dto,
  loanSize: 900000,
  totalInterest: 100000,
  totalLoanCost: 1000000,
  lifetimeCost: 1100000,
  monthlyInterest: 250,
})

const initialValues: LoanFormDTO = {
  price: 1000000,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: 100000,
  loanPeriodYears: 35,
  interestRate: 2.88,
}

test('copies fields and calculations to the clipboard', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(
    <LoanForm
      initialValues={initialValues}
      onChange={calculate}
      onFinish={() => {}}
      showCopy
    />
  )

  await userEvent.click(screen.getByRole('button', { name: /copy/i }))

  expect(writeText).toHaveBeenCalledTimes(1)
  const text = writeText.mock.calls[0][0]
  // starts directly with the fields, no title header
  expect(text.startsWith('Price: 1,000,000')).toBe(true)
  // no dangling Name line when the name is empty
  expect(text).not.toContain('Name:')
  expect(text).toContain('Price: 1,000,000')
  expect(text).toContain('Down Payment: 10% (100,000)')
  expect(text).toContain('Loan Period: 35 years')
  expect(text).toContain('Interest Rate: 2.88%')
  expect(text).toContain('Monthly: 1,000')
  expect(text).toContain('Loan Size: 900,000')
  // totals live in their own final section
  expect(text).toContain(
    '---\nTotal Interest: 100,000\nLifetime Cost: 1,100,000'
  )
  expect(await screen.findByText('Copied')).toBeInTheDocument()
})

test('does not render a copy button without showCopy', () => {
  render(
    <LoanForm
      initialValues={initialValues}
      onChange={calculate}
      onFinish={() => {}}
    />
  )
  expect(screen.queryByRole('button', { name: /copy/i })).toBeNull()
})
