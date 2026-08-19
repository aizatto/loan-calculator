import { render, screen } from '@testing-library/react'
import App from './App'

beforeEach(() => {
  window.localStorage.clear()
  // HashRouter reads the URL hash, which persists across tests
  window.location.hash = '#/'
})

// routes are lazy-loaded, so wait for the page chunk to resolve
test('lands on the car loan calculator by default', async () => {
  render(<App />)
  expect(
    await screen.findByRole('heading', { name: /car loan calculator/i })
  ).toBeInTheDocument()
})

test('lands on the last used calculator', async () => {
  window.localStorage.setItem('last-calculator', '/home')
  render(<App />)
  expect(
    await screen.findByRole('heading', { name: /home loan calculator/i })
  ).toBeInTheDocument()
})
