'use client'

import React from 'react'
import { Button } from '@/shared/ui/button'
import { useTheme } from '@/shared/providers/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}