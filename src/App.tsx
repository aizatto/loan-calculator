import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { Menu } from './components/menu'
import {
  lastCalculatorPath,
  useRememberCalculator,
} from './hooks/lastCalculator'
import { CarPage } from './routes/CarPage'
import { CarBudgetPage } from './routes/CarBudgetPage'
import { HomePage } from './routes/HomePage'
import { HomeBudgetPage } from './routes/HomeBudgetPage'

function AppRoutes() {
  useRememberCalculator()
  return (
    <>
      <Menu />
      <main className="flex flex-col gap-4 p-4">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={lastCalculatorPath()} replace />}
          />
          <Route path="/car" element={<CarPage />} />
          <Route path="/car-budget" element={<CarBudgetPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home-budget" element={<HomeBudgetPage />} />
        </Routes>
      </main>
    </>
  )
}

function App() {
  return (
    <>
      <HashRouter>
        <AppRoutes />
        <footer className="p-4 text-sm text-muted-foreground">
          Build:{' '}
          {import.meta.env.DEV ? (
            'development'
          ) : (
            <a
              className="underline underline-offset-4"
              href={`https://github.com/aizatto/loan-calculator/commit/${import.meta.env.VITE_GIT_SHA}`}
            >
              {import.meta.env.VITE_GIT_SHA}
            </a>
          )}
        </footer>
      </HashRouter>
    </>
  )
}

export default App
