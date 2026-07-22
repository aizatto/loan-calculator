import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HomePage } from './HomePage'
import { Details, DownPaymentType } from '../components/types'

const row = (key: string, price: number): Details => ({
  key,
  name: `row-${key}`,
  price,
  monthly: 1000,
  downPaymentType: DownPaymentType.PERCENTAGE,
  downPaymentPercentage: 10,
  downPaymentFixed: price * 0.1,
  loanPeriodYears: 35,
  interestRate: 2.88,
  loanSize: price * 0.9,
  totalInterest: 100000,
  totalLoanCost: 500000,
  lifetimeCost: 600000,
  monthlyInterest: 250,
})

beforeEach(() => {
  window.localStorage.clear()
})

test('load button fills the form with the selected row', async () => {
  window.localStorage.setItem(
    'home-loan',
    JSON.stringify([row('a', 111111), row('b', 222222)])
  )

  render(<HomePage />)

  const price = screen.getByLabelText<HTMLInputElement>('Price')
  expect(price.value).toBe('111111')

  const loadButtons = screen.getAllByRole('button', { name: 'Load' })
  expect(loadButtons).toHaveLength(2)

  await userEvent.click(loadButtons[1])
  expect(price.value).toBe('222222')
  expect(screen.getByLabelText<HTMLInputElement>('Name').value).toBe('row-b')
})

test('delete button removes the row after confirmation', async () => {
  window.localStorage.setItem(
    'home-loan',
    JSON.stringify([row('a', 111111), row('b', 222222)])
  )

  render(<HomePage />)
  expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(2)

  await userEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0])
  // confirm in the alert dialog
  await userEvent.click(screen.getByRole('button', { name: 'Delete' }))

  expect(screen.getAllByRole('button', { name: 'Delete' })).toHaveLength(1)
  const stored = JSON.parse(window.localStorage.getItem('home-loan')!)
  expect(stored).toHaveLength(1)
  expect(stored[0].key).toBe('b')
})
