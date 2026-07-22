import { render, screen } from '@testing-library/react'
import App from './App'

test('renders the car loan calculator by default', () => {
  render(<App />)
  const heading = screen.getByRole('heading', {
    name: /car loan calculator/i,
  })
  expect(heading).toBeInTheDocument()
})
