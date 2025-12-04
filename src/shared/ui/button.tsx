import React from 'react'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '@/shared/utils/cn'

const buttonVariants = cva(
  // Base styles - común para todas las variantes
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Solid - CTA principal sin glassmorphism para máximo impacto
        solid: "bg-primary-500 text-white shadow-lg hover:bg-primary-600 hover:shadow-xl dark:shadow-primary-500/25",
        
        // Glass - Efecto glassmorphism para acciones secundarias
        glass: "glass-panel glass-text backdrop-blur-[12px] border hover:shadow-glass-hover text-accent-primary dark:text-light-base",
        
        // Ghost - Minimalista para navegación
        ghost: "hover:glass-light dark:hover:glass-dark glass-text text-accent-primary dark:text-light-base",
        
        // Outline - Bordes definidos
        outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white dark:hover:text-white",
        
        // Destructive - Para acciones peligrosas
        destructive: "bg-danger-500 text-white hover:bg-danger-700 shadow-lg",
      },
      size: {
        sm: "h-9 rounded-[1rem] px-3 text-xs",
        md: "h-10 rounded-[1rem] px-4 py-2",
        lg: "h-12 rounded-[1.5rem] px-6 py-3 text-base",
        xl: "h-14 rounded-[2rem] px-8 py-4 text-lg",
        icon: "h-10 w-10 rounded-[1rem]",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }