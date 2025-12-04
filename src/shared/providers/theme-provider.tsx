'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  systemTheme: 'light' | 'dark'
  effectiveTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return 'system'
  try {
    const stored = localStorage.getItem('theme') as Theme
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error)
  }
  return 'system'
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    // Only access localStorage on client side
    return typeof window !== 'undefined' ? getStoredTheme() : defaultTheme
  })
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    return typeof window !== 'undefined' ? getSystemTheme() : 'light'
  })
  const [mounted, setMounted] = useState(false)

  // Set mounted flag after hydration
  useEffect(() => {
    setMounted(true)
    
    // Update theme and system theme on mount
    const storedTheme = getStoredTheme()
    const currentSystemTheme = getSystemTheme()
    
    setTheme(storedTheme)
    setSystemTheme(currentSystemTheme)
  }, [])

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted) return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [mounted])

  const effectiveTheme = theme === 'system' ? systemTheme : theme

  // Apply theme to DOM and persist to localStorage
  useEffect(() => {
    if (!mounted) return
    
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
    
    // Persist theme preference
    try {
      localStorage.setItem('theme', theme)
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error)
    }
  }, [theme, effectiveTheme, mounted])

  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  // Prevent hydration mismatch by rendering children with default theme until mounted
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ 
        theme: defaultTheme, 
        setTheme: updateTheme, 
        systemTheme: 'light', 
        effectiveTheme: 'light' 
      }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme: updateTheme, systemTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}