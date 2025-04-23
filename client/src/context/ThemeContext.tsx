'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { themes, type ThemeKey, type Theme } from '@/lib/themes'

interface ThemeContextType {
  currentTheme: ThemeKey
  theme: Theme
  setTheme: (theme: ThemeKey) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('teal')

  const value: ThemeContextType = {
    currentTheme,
    theme: themes[currentTheme],
    setTheme: setCurrentTheme
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
