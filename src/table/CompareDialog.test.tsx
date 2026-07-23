import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoanTable } from './LoanTable'
import { Details, DownPaymentType } from '../components/types'

const record = (key: string, name: string, price: number): Details => ({
  key,
  name,
  price,
  sqft: price / 1000,
  pricePerSqft: 1000,
  monthly: price / 100,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: price * 0.1,
  loanPeriodYears: 35,
  interestRate: 2.88,
  loanSize: price * 0.9,
  totalInterest: price / 2,
  totalLoanCost: price * 1.4,
  lifetimeCost: price * 1.5,
  monthlyInterest: price / 1000,
})

const dataSource = [
  record('a', 'Condo A', 1000000),
  record('b', 'Condo B', 1200000),
  record('c', 'Condo C', 900000),
]

test('selecting rows enables compare with deltas against the first pick', async () => {
  render(
    <LoanTable
      columns={['name', 'price', 'pricePerSqft', 'monthly', 'lifetimeCost']}
      dataSource={dataSource}
    />
  )

  // nothing selected: no compare toolbar
  expect(screen.queryByRole('button', { name: /compare/i })).toBeNull()

  const checkboxes = screen.getAllByRole('checkbox', { name: 'Select row' })
  // select B first (baseline), then A
  await userEvent.click(checkboxes[1])
  expect(screen.getByRole('button', { name: 'Compare (1)' })).toBeDisabled()
  await userEvent.click(checkboxes[0])

  await userEvent.click(screen.getByRole('button', { name: 'Compare (2)' }))

  // baseline is the first selected row (Condo B)
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveTextContent('Condo B(base)')
  // Condo A price shows its value and the delta vs B: 1,000,000 - 1,200,000
  expect(dialog).toHaveTextContent('1,000,000-200,000')
  // lifetime cost delta: 1,500,000 - 1,800,000
  expect(dialog).toHaveTextContent('1,500,000-300,000')
  // sqft row is included ahead of price per sqft, with its delta
  expect(dialog).toHaveTextContent('Sqft')
  expect(dialog).toHaveTextContent('1,000-200')

  // copy as markdown produces a markdown table with inline deltas
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.assign(navigator, { clipboard: { writeText } })
  await userEvent.click(
    screen.getByRole('button', { name: /copy as markdown/i })
  )
  const markdown = writeText.mock.calls[0][0]
  const lines = markdown.split('\n')
  expect(lines[0]).toBe('| Field | Condo B (base) | Condo A |')
  expect(lines[1]).toBe('| --- | ---: | ---: |')
  expect(lines).toContain('| Price | 1,200,000 | 1,000,000 (-200,000) |')
  expect(lines).toContain(
    '| Lifetime Cost | 1,800,000 | 1,500,000 (-300,000) |'
  )
})

test('clear resets the selection', async () => {
  render(<LoanTable columns={['name', 'price']} dataSource={dataSource} />)

  await userEvent.click(
    screen.getAllByRole('checkbox', { name: 'Select row' })[0]
  )
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }))
  expect(screen.queryByRole('button', { name: /compare/i })).toBeNull()
})
