import './App.css'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { Menu } from './components/menu'
import { CarPage } from './routes/CarPage'
import { CarBudgetPage } from './routes/CarBudgetPage'
import { HomePage } from './routes/HomePage'
import { HomeBudgetPage } from './routes/HomeBudgetPage'

function App() {
  return (
    <>
      <HashRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<CarPage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/car-budget" element={<CarBudgetPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/home-budget" element={<HomeBudgetPage />} />
        </Routes>
        <div className="p-3">
          Build:{' '}
          {process.env.NODE_ENV === 'development' ? (
            'development'
          ) : (
            <a
              href={`https://github.com/aizatto/loan-calculator/commit/${process.env.REACT_APP_GIT_SHA}`}
            >
              {process.env.REACT_APP_GIT_SHA}
            </a>
          )}
        </div>
      </HashRouter>
    </>
  )
}

export default App
