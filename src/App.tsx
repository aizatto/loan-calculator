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
          <Route path={`${process.env.REACT_APP_PATH}/`} element={<CarBudgetPage />} />
          <Route path={`${process.env.REACT_APP_PATH}/car`} element={<CarPage />} />
          <Route path={`${process.env.REACT_APP_PATH}/car-budget`} element={<CarBudgetPage />} />
          <Route path={`${process.env.REACT_APP_PATH}/home`} element={<HomeBudgetPage />} />
          <Route path={`${process.env.REACT_APP_PATH}/home-budget`} element={<HomeBudgetPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
