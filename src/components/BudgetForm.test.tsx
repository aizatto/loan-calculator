import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetForm } from './BudgetForm'
import { BudgetFormDTO, Details, DownPaymentType } from './types'

const calculate = (dto: BudgetFormDTO): Details => ({
  key: 'test',
  price: 500000,
  ...dto,
  loanSize: 450000,
  totalInterest: 50000,
  totalLoanCost: 500000,
  lifetimeCost: 550000,
  monthlyInterest: 250,
})

const initialValues: BudgetFormDTO = {
  monthly: 2000,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: 26000,
  loanPeriodYears: 9,
  interestRate: 2.5,
}

test('copies fields and calculations to the clipboard', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })

  render(
    <BudgetForm
      initialValues={initialValues}
      onChange={calculate}
      onFinish={() => {}}
      copyTitle="Reverse Car Loan Calculator"
    />
  )

  await userEvent.click(screen.getByRole('button', { name: /copy/i }))

  expect(writeText).toHaveBeenCalledTimes(1)
  const text = writeText.mock.calls[0][0]
  expect(text.startsWith('Reverse Car Loan Calculator\n---\n')).toBe(true)
  expect(text).toContain('Monthly: 2,000')
  expect(text).toContain('Down Payment: 10% (26,000)')
  expect(text).toContain('Loan Period: 9 years')
  expect(text).toContain('Interest Rate: 2.5%')
  expect(text).toContain('Price: 500,000')
  expect(text).toContain('Loan Size: 450,000')
  expect(text).toContain('---\nTotal Interest: 50,000\nLifetime Cost: 550,000')
  expect(await screen.findByText('Copied')).toBeInTheDocument()
})
