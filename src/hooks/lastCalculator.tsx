import { useEffect } from 'react'
import { useLocation } from 'react-router'

const STORAGE_KEY = 'last-calculator'

export const CALCULATOR_PATHS = [
  '/car',
  '/car-budget',
  '/home',
  '/home-budget',
] as const

// the calculator route to land on, defaulting to the car loan calculator
export const lastCalculatorPath = (): string => {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored && (CALCULATOR_PATHS as readonly string[]).includes(stored)
    ? stored
    : '/car'
}

// records the active calculator route so the next landing can restore it
export const useRememberCalculator = () => {
  const { pathname } = useLocation()
  useEffect(() => {
    if ((CALCULATOR_PATHS as readonly string[]).includes(pathname)) {
      localStorage.setItem(STORAGE_KEY, pathname)
    }
  }, [pathname])
}
