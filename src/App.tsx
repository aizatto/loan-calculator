import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CarPage } from './car/CarPage'
import { CarBudgetPage } from './car/CarBudgetPage'
import { HomeBudgetPage } from './car/HomeBudgetPage'
import { Menu } from './components/menu'

function App() {
  return (
    <>
      <BrowserRouter>
        <Menu />
        <Routes>
          <Route path="/" element={<CarBudgetPage />} />
          <Route path="/car" element={<CarPage />} />
          <Route path="/car-budget" element={<CarBudgetPage />} />
          <Route path="/home" element={<HomeBudgetPage />} />
          <Route path="/home-budget" element={<HomeBudgetPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
