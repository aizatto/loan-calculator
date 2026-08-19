import { lazy, Suspense } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router'
import { TooltipProvider } from './components/ui/tooltip'
import { Menu } from './components/menu'
import {
  lastCalculatorPath,
  useRememberCalculator,
} from './hooks/lastCalculator'

// each calculator is a lazily-loaded chunk so the initial bundle only carries
// the shell and whichever calculator the landing route resolves to
const CarPage = lazy(() =>
  import('./routes/CarPage').then((m) => ({ default: m.CarPage }))
)
const CarBudgetPage = lazy(() =>
  import('./routes/CarBudgetPage').then((m) => ({ default: m.CarBudgetPage }))
)
const HomePage = lazy(() =>
  import('./routes/HomePage').then((m) => ({ default: m.HomePage }))
)
const HomeBudgetPage = lazy(() =>
  import('./routes/HomeBudgetPage').then((m) => ({ default: m.HomeBudgetPage }))
)
const MalaysiaHomePage = lazy(() =>
  import('./routes/MalaysiaHomePage').then((m) => ({
    default: m.MalaysiaHomePage,
  }))
)

function AppRoutes() {
  useRememberCalculator()
  return (
    <>
      <Menu />
      <main className="flex flex-col gap-4 p-4">
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={<Navigate to={lastCalculatorPath()} replace />}
            />
            <Route path="/car" element={<CarPage />} />
            <Route path="/car-budget" element={<CarBudgetPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/home-budget" element={<HomeBudgetPage />} />
            <Route path="/malaysia-home" element={<MalaysiaHomePage />} />
          </Routes>
        </Suspense>
      </main>
    </>
  )
}

function App() {
  return (
    <TooltipProvider>
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
    </TooltipProvider>
  )
}

export default App
