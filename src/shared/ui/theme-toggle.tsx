'use client'

import React from 'react'
import { Button } from '@/shared/ui/button'
import { useTheme } from '@/shared/providers/theme-provider'

export function ThemeToggle() {
  const { effectiveTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    // Switch between light and dark directly, not system
    setTheme(effectiveTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="glass"
      size="icon"
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50"
      aria-label="Toggle theme"
    >
      {effectiveTheme === 'dark' ? '☀️' : '🌙'}
    </Button>
  )
}