import React from 'react'
import { cn } from '@/shared/utils/cn'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'glass' | 'flat'
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'glass', error, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-dark-base border border-gray-300 dark:border-gray-600',
      glass: 'glass-input placeholder:text-accent-primary/50 dark:placeholder:text-light-base/50',
      flat: 'bg-white/80 dark:bg-white/5 border border-white/30 dark:border-white/10 backdrop-blur-sm'
    }
    
    return (
      <input
        type={type}
        className={cn(
          // Base styles
          "flex h-10 w-full rounded-[1rem] px-3 py-2 text-sm",
          "glass-text transition-all duration-200",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500/50",
          "disabled:cursor-not-allowed disabled:opacity-50",
          // Variant styles
          variants[variant],
          // Error styles
          error && "border-danger-500 focus:border-danger-500 focus:ring-danger-500/20",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Input.displayName = "Input"

export { Input }