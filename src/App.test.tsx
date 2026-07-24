import { render, screen } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  window.localStorage.clear()
  // HashRouter reads the URL hash, which persists across tests
  window.location.hash = '#/'
})

test('lands on the car loan calculator by default', () => {
  render(<App />)
  expect(
    screen.getByRole('heading', { name: /car loan calculator/i })
  ).toBeInTheDocument()
})

test('lands on the last used calculator', () => {
  window.localStorage.setItem('last-calculator', '/home')
  render(<App />)
  expect(
    screen.getByRole('heading', { name: /home loan calculator/i })
  ).toBeInTheDocument()
})
