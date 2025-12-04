import React from 'react'
import { cn } from '@/shared/utils/cn'

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'small' | 'caption'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  glass?: boolean
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'p',
  weight = 'normal',
  glass = true,
  className,
  children,
  ...props
}) => {
  const variants = {
    h1: 'text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight',
    h2: 'text-3xl md:text-4xl font-semibold leading-tight tracking-tight',
    h3: 'text-2xl md:text-3xl font-semibold leading-snug',
    h4: 'text-xl md:text-2xl font-medium leading-snug',
    p: 'text-base leading-relaxed',
    small: 'text-sm leading-normal',
    caption: 'text-xs leading-tight tracking-wide uppercase',
  }

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }

  const Component = variant === 'p' ? 'p' : variant === 'small' || variant === 'caption' ? 'span' : variant

  return React.createElement(
    Component,
    {
      className: cn(
        variants[variant],
        weights[weight],
        glass ? 'glass-text text-accent-primary dark:text-light-base' : 'text-accent-primary dark:text-light-base',
        // Spacing bottom para headings
        ['h1', 'h2', 'h3', 'h4'].includes(variant) && 'mb-4',
        variant === 'p' && 'mb-2',
        className
      ),
      ...props
    },
    children
  )
}

export { Typography }