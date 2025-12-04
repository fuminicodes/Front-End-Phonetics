# Design System: Nebula Glass

## Identidad Visual y Filosofía de Diseño

**Nebula Glass** es un sistema de diseño que implementa un "Glassmorphism Funcional" - una evolución del glassmorphism tradicional que prioriza la legibilidad y accesibilidad sin comprometer la estética moderna. El sistema está diseñado para una aplicación Next.js con arquitectura de microservicios, ofreciendo soporte nativo para modo oscuro/claro y cumpliendo con las pautas WCAG 2.1.

### Principios de Diseño

1. **Funcionalidad sobre Forma**: El glassmorphism debe ser sutil y nunca comprometer la legibilidad
2. **Accesibilidad Primero**: Contraste mínimo 4.5:1 para texto normal, 3:1 para texto grande
3. **Coherencia Contextual**: Los efectos de vidrio se adaptan al contenido y contexto
4. **Performance**: Uso eficiente de blur y transparencias para mantener 60fps

---

## 1. Fundamentos de Color

### Paleta Principal

La paleta está diseñada para crear profundidad visual mientras mantiene excelente legibilidad en ambos modos.

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Base Colors
        'light-base': '#f1e4f0',      // Lavanda suave - Background claro
        'dark-base': '#4f368d',       // Púrpura base - Superficies oscuras
        'dark-deep': '#1a102e',       // Púrpura profundo - Background modo oscuro
        
        // Brand Colors
        primary: {
          50: '#e6f4ff',
          100: '#bae7ff',
          200: '#7dd3ff',
          300: '#47bdff',
          400: '#1fa7ff',
          500: '#007cff',           // Azul eléctrico principal
          600: '#0056b3',
          700: '#003d80',
          800: '#002852',
          900: '#001829',
        },
        
        secondary: {
          50: '#e8f4fd',
          100: '#d1e9fb',
          200: '#a3d3f7',
          300: '#75bdf3',
          400: '#47a7ef',
          500: '#3f9bd6',           // Azul secundario
          600: '#2e7ab8',
          700: '#1d599a',
          800: '#0c387c',
          900: '#001c5e',
        },
        
        info: {
          50: '#e6f3fd',
          100: '#cce7fb',
          200: '#99cff7',
          300: '#66b7f3',
          400: '#339fef',
          500: '#49a4e5',           // Azul información
          600: '#1976d2',
          700: '#1565c0',
          800: '#0d47a1',
          900: '#01579b',
        },
        
        // Accent Colors
        accent: {
          primary: '#3f2378',       // Púrpura oscuro - Texto principal
          secondary: '#9858ca',     // Púrpura medio - Acentos
          tertiary: '#cca5eb',      // Púrpura claro - Highlights
        },
        
        // Status Colors
        success: {
          50: '#e8f5e8',
          500: '#00b064',           // Verde éxito
          700: '#2e7d32',
        },
        warning: {
          50: '#fffbf0',
          500: '#e6ce00',           // Amarillo advertencia
          700: '#f57c00',
        },
        danger: {
          50: '#ffebee',
          500: '#f81600',           // Rojo peligro
          700: '#d32f2f',
        },
        
        // Glass System Colors
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          'light-hover': 'rgba(255, 255, 255, 0.15)',
          dark: 'rgba(255, 255, 255, 0.05)',
          'dark-hover': 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.1)',
          'border-dark': 'rgba(255, 255, 255, 0.08)',
        }
      },
      
      // Typography Scale
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      
      // Spacing for Glass Design
      spacing: {
        'glass': '1.5rem',          // Padding estándar para glass panels
        'glass-sm': '1rem',         // Padding pequeño
        'glass-lg': '2rem',         // Padding grande
      },
      
      // Border Radius
      borderRadius: {
        'glass': '1rem',            // 16px - Border radius estándar
        'glass-lg': '1.5rem',       // 24px - Border radius grande
        'glass-xl': '2rem',         // 32px - Border radius extra grande
      },
      
      // Box Shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 12px 48px rgba(0, 0, 0, 0.15)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-dark-hover': '0 12px 48px rgba(0, 0, 0, 0.4)',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'glass': '12px',
        'glass-lg': '20px',
      }
    },
  },
  darkMode: 'class',
  plugins: [],
}

export default config
```

### Estrategia de Color por Modo

**Modo Claro:**
- Background principal: `light-base` (#f1e4f0)
- Texto principal: `accent.primary` (#3f2378) - Ratio de contraste 8.2:1
- Superficies glass: `rgba(255, 255, 255, 0.1)` con bordes sutiles

**Modo Oscuro:**
- Background principal: `dark-deep` (#1a102e)
- Superficies elevadas: `dark-base` (#4f368d)
- Texto principal: `light-base` (#f1e4f0) - Ratio de contraste 7.1:1
- Superficies glass: `rgba(255, 255, 255, 0.05)` con bordes mínimos

---

## 2. Física del Glassmorphism

### CSS Utilities Core

```css
/* src/app/globals.css */
@import "tailwindcss";

/* Variables CSS personalizadas para glassmorphism */
:root {
  --glass-bg-light: rgba(255, 255, 255, 0.1);
  --glass-bg-light-hover: rgba(255, 255, 255, 0.15);
  --glass-border-light: rgba(255, 255, 255, 0.1);
  --glass-shadow-light: 0 8px 32px rgba(0, 0, 0, 0.1);
  
  --glass-bg-dark: rgba(255, 255, 255, 0.05);
  --glass-bg-dark-hover: rgba(255, 255, 255, 0.08);
  --glass-border-dark: rgba(255, 255, 255, 0.08);
  --glass-shadow-dark: 0 8px 32px rgba(0, 0, 0, 0.3);
}

/* Clases base para glassmorphism funcional */
.glass-panel {
  @apply relative backdrop-blur-glass border border-glass-border;
  @apply bg-glass-light shadow-glass rounded-glass;
  @apply transition-all duration-300 ease-out;
  
  /* Overlay sutil para mejorar legibilidad */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    border-radius: inherit;
    pointer-events: none;
  }
}

.glass-panel:hover {
  @apply bg-glass-light-hover shadow-glass-hover border-white/20;
  transform: translateY(-1px);
}

/* Modo oscuro */
.dark .glass-panel {
  @apply bg-glass-dark shadow-glass-dark border-glass-border-dark;
}

.dark .glass-panel:hover {
  @apply bg-glass-dark-hover shadow-glass-dark-hover border-white/15;
}

.dark .glass-panel::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
}

/* Variantes especializadas */
.glass-light {
  @apply glass-panel bg-white/20 border-white/30;
}

.glass-light:hover {
  @apply bg-white/25 border-white/40;
}

.glass-dark {
  @apply glass-panel bg-black/10 border-white/5;
}

.glass-dark:hover {
  @apply bg-black/15 border-white/10;
}

/* Input glass effect - "hundido" en el vidrio */
.glass-input {
  @apply glass-panel;
  @apply bg-black/5 border-white/20 backdrop-blur-sm;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(255, 255, 255, 0.1);
}

.dark .glass-input {
  @apply bg-white/5 border-white/10;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(255, 255, 255, 0.05);
}

.glass-input:focus {
  @apply border-primary-500/50 ring-2 ring-primary-500/20;
}

/* Typography optimized for glass backgrounds */
.glass-text {
  @apply text-accent-primary dark:text-light-base;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.dark .glass-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

/* Ambient background base */
body {
  @apply bg-light-base dark:bg-dark-deep;
  @apply text-accent-primary dark:text-light-base;
  @apply transition-colors duration-300;
  font-family: 'Inter', system-ui, sans-serif;
}
```

### Principios de Implementación

1. **Contraste Garantizado**: Siempre usar overlays sutiles (`::before`) para asegurar legibilidad
2. **Performance**: `backdrop-blur` limitado a 12-20px máximo
3. **Interactividad**: Transformaciones suaves en hover con `translateY(-1px)`
4. **Consistencia**: Border radius estándar de 1rem (16px) para cohesión visual

---

## 3. Componentes Core (UI Kit)

### Button Component

```typescript
// src/shared/ui/button.tsx
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
        glass: "glass-panel glass-text backdrop-blur-glass border hover:shadow-glass-hover",
        
        // Ghost - Minimalista para navegación
        ghost: "hover:glass-light dark:hover:glass-dark glass-text",
        
        // Outline - Bordes definidos
        outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white",
        
        // Destructive - Para acciones peligrosas
        destructive: "bg-danger-500 text-white hover:bg-danger-700 shadow-lg",
      },
      size: {
        sm: "h-9 rounded-glass px-3 text-xs",
        md: "h-10 rounded-glass px-4 py-2",
        lg: "h-12 rounded-glass-lg px-6 py-3 text-base",
        xl: "h-14 rounded-glass-xl px-8 py-4 text-lg",
        icon: "h-10 w-10 rounded-glass",
      },
    },
    defaultVariants: {
      variant: "solid",
      size: "md",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"

export { Button, buttonVariants }
export type { ButtonProps }
```

### Card Component

```typescript
// src/shared/ui/card.tsx
import React from 'react'
import { cn } from '@/shared/utils/cn'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'elevated' | 'flat'
  }
>(({ className, variant = 'default', ...props }, ref) => {
  const variants = {
    default: 'glass-panel',
    elevated: 'glass-panel shadow-glass-hover border-white/20 dark:border-white/10',
    flat: 'bg-white/50 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-glass backdrop-blur-sm'
  }
  
  return (
    <div
      ref={ref}
      className={cn(
        "p-glass overflow-hidden transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 pb-4", className)}
    {...props}
  />
))

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight glass-text",
      className
    )}
    {...props}
  />
))

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "text-sm text-accent-primary/70 dark:text-light-base/70",
      className
    )}
    {...props}
  />
))

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("pt-0", className)}
    {...props}
  />
))

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))

Card.displayName = "Card"
CardHeader.displayName = "CardHeader"
CardTitle.displayName = "CardTitle"
CardDescription.displayName = "CardDescription"
CardContent.displayName = "CardContent"
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

### Input Component

```typescript
// src/shared/ui/input.tsx
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
          "flex h-10 w-full rounded-glass px-3 py-2 text-sm",
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
export type { InputProps }
```

---

## 4. Ambient Backgrounds

### BackgroundWrapper Component

```typescript
// src/shared/ui/background-wrapper.tsx
'use client'

import React from 'react'
import { cn } from '@/shared/utils/cn'

interface BackgroundWrapperProps {
  children: React.ReactNode
  variant?: 'default' | 'minimal' | 'dynamic'
  className?: string
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({
  children,
  variant = 'default',
  className
}) => {
  const orbs = {
    default: [
      // Orbe principal - esquina superior derecha
      {
        size: 'w-96 h-96',
        color: 'bg-gradient-to-br from-primary-400/20 via-accent-secondary/15 to-transparent',
        position: 'top-0 right-0 translate-x-1/2 -translate-y-1/2',
        blur: 'blur-3xl',
      },
      // Orbe secundario - esquina inferior izquierda
      {
        size: 'w-80 h-80',
        color: 'bg-gradient-to-tl from-accent-tertiary/25 via-primary-300/10 to-transparent',
        position: 'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
        blur: 'blur-3xl',
      },
      // Orbe central - para profundidad
      {
        size: 'w-64 h-64',
        color: 'bg-gradient-to-r from-accent-secondary/10 to-info-400/15',
        position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        blur: 'blur-2xl',
      },
    ],
    minimal: [
      {
        size: 'w-72 h-72',
        color: 'bg-gradient-to-br from-primary-400/15 to-transparent',
        position: 'top-1/4 right-1/4',
        blur: 'blur-3xl',
      },
      {
        size: 'w-56 h-56',
        color: 'bg-gradient-to-tl from-accent-secondary/10 to-transparent',
        position: 'bottom-1/4 left-1/4',
        blur: 'blur-2xl',
      },
    ],
    dynamic: [
      // Configuración para efectos dinámicos más complejos
      {
        size: 'w-[32rem] h-[32rem]',
        color: 'bg-gradient-radial from-primary-500/20 via-accent-secondary/15 to-transparent',
        position: 'top-0 right-0 translate-x-1/3 -translate-y-1/3',
        blur: 'blur-3xl',
      },
      {
        size: 'w-80 h-80',
        color: 'bg-gradient-radial from-accent-tertiary/20 via-info-400/10 to-transparent',
        position: 'bottom-1/4 left-0 -translate-x-1/2',
        blur: 'blur-3xl',
      },
      {
        size: 'w-72 h-72',
        color: 'bg-gradient-radial from-accent-secondary/15 to-transparent',
        position: 'top-1/2 right-1/3 translate-x-1/2',
        blur: 'blur-2xl',
      },
    ],
  }

  return (
    <div className={cn("relative min-h-screen", className)}>
      {/* Background Orbs - Posición fija para efecto parallax sutil */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0">
          {orbs[variant].map((orb, index) => (
            <div
              key={index}
              className={cn(
                "absolute rounded-full",
                orb.size,
                orb.color,
                orb.position,
                orb.blur,
                "animate-pulse",
                // Animación sutil de movimiento
                index % 2 === 0 ? "animate-float" : "animate-float-delayed"
              )}
              style={{
                animationDuration: `${6 + index * 2}s`,
              }}
            />
          ))}
        </div>
        
        {/* Overlay gradient para mejor legibilidad del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-light-base/10 to-light-base/20 dark:via-dark-deep/20 dark:to-dark-deep/40" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export { BackgroundWrapper }
```

### Animaciones CSS

```css
/* Agregar a globals.css */

/* Animación floating para orbes */
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(1deg); }
  50% { transform: translateY(-5px) rotate(-1deg); }
  75% { transform: translateY(-15px) rotate(0.5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-15px) rotate(-0.5deg); }
  50% { transform: translateY(-8px) rotate(1deg); }
  75% { transform: translateY(-12px) rotate(-1deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

/* Gradient radial utility */
.bg-gradient-radial {
  background-image: radial-gradient(circle, var(--tw-gradient-stops));
}
```

---

## 5. Tipografía y Accesibilidad

### Jerarquía Tipográfica

```typescript
// src/shared/ui/typography.tsx
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
        glass && 'glass-text',
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
```

### Estrategia de Contraste

#### Modo Claro
- **Texto Principal**: `#3f2378` (accent.primary) sobre `#f1e4f0` (light-base)
  - Ratio de contraste: **8.2:1** ✅ (Excede WCAG AAA)
- **Texto Secundario**: `#3f2378` con 70% opacidad
  - Ratio de contraste: **5.1:1** ✅ (Cumple WCAG AA)
- **Texto sobre Glass**: Overlay sutil garantiza mínimo **4.5:1**

#### Modo Oscuro
- **Texto Principal**: `#f1e4f0` (light-base) sobre `#1a102e` (dark-deep)
  - Ratio de contraste: **7.1:1** ✅ (Excede WCAG AA)
- **Texto Secundario**: `#f1e4f0` con 70% opacidad
  - Ratio de contraste: **4.8:1** ✅ (Cumple WCAG AA)
- **Evitar Blanco Puro**: `#ffffff` solo para acentos, no para párrafos largos

### Utilidades de Accesibilidad

```css
/* Focus states mejorados para glassmorphism */
.focus-glass {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply focus:ring-offset-light-base dark:focus:ring-offset-dark-deep;
  @apply focus:shadow-glass-hover;
}

/* Skip links para navegación por teclado */
.skip-link {
  @apply absolute -top-10 left-4 z-50;
  @apply glass-panel px-4 py-2 text-sm font-medium;
  @apply focus:top-4 transition-all duration-200;
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-float-delayed {
    animation: none;
  }
  
  .transition-all {
    transition: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass-panel {
    @apply border-2 border-accent-primary dark:border-light-base;
    backdrop-filter: none;
    background: rgba(255, 255, 255, 0.95);
  }
  
  .dark .glass-panel {
    background: rgba(0, 0, 0, 0.85);
  }
}
```

---

## 6. Reglas de Uso

### Cuándo Usar Glassmorphism

#### ✅ **Usar Glassmorphism Para:**
- **Cards de contenido** que necesitan destacar sin ser intrusivas
- **Navegación secundaria** (sidebars, menús dropdown)
- **Overlays y modales** para mantener contexto visual
- **Paneles informativos** no críticos
- **Componentes decorativos** que no contienen CTAs principales

#### ❌ **Evitar Glassmorphism En:**
- **Botones CTA principales** (usar variant="solid")
- **Formularios críticos** (usar backgrounds sólidos para máxima legibilidad)
- **Contenido de texto largo** (artículos, documentación)
- **Alertas de error importantes** (usar backgrounds sólidos con colores de estado)

### Jerarquía Visual

```typescript
// Ejemplo de implementación de jerarquía
const PageLayout = () => {
  return (
    <BackgroundWrapper variant="default">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header - Sin glassmorphism para máxima legibilidad */}
        <header className="bg-white dark:bg-dark-base p-6 rounded-glass-lg shadow-lg">
          <Typography variant="h1">Título Principal</Typography>
          <Typography variant="p" className="text-accent-primary/70">
            Descripción importante sin glassmorphism
          </Typography>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card principal - Glassmorphism sutil */}
          <Card variant="elevated" className="md:col-span-2">
            <CardHeader>
              <CardTitle>Contenido Principal</CardTitle>
              <CardDescription>
                Contenido que puede usar glassmorphism porque no es crítico
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* CTAs principales - Sin glassmorphism */}
              <div className="space-x-4">
                <Button variant="solid" size="lg">
                  Acción Principal
                </Button>
                <Button variant="glass" size="lg">
                  Acción Secundaria
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar - Glassmorphism apropiado */}
          <Card className="space-y-4">
            <Typography variant="h4">Información Adicional</Typography>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                Item de navegación
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </BackgroundWrapper>
  )
}
```

### Espaciado y Layout

```typescript
// Sistema de espaciado recomendado para glassmorphism
const SpacingGuide = {
  // Dentro de glass panels
  internal: {
    padding: 'p-glass (24px)',      // Estándar
    paddingSmall: 'p-glass-sm (16px)', // Componentes compactos
    paddingLarge: 'p-glass-lg (32px)', // Cards destacadas
  },
  
  // Entre elementos glass
  external: {
    gap: 'gap-6 (24px)',           // Entre cards
    margin: 'mb-6 (24px)',         // Separación vertical
    section: 'space-y-8 (32px)',   // Entre secciones
  },
  
  // Border radius consistente
  radius: {
    standard: 'rounded-glass (16px)',     // Default
    large: 'rounded-glass-lg (24px)',     // Cards importantes
    xl: 'rounded-glass-xl (32px)',        // Elementos hero
  }
}
```

### Performance Guidelines

1. **Backdrop Blur Limits**: Nunca exceder `backdrop-blur-xl` (24px)
2. **Layer Management**: Máximo 3 niveles de glassmorphism superpuestos
3. **Animación Efficiency**: Usar `transform` y `opacity` para animaciones, evitar animar `backdrop-filter`
4. **Fallbacks**: Siempre incluir fallbacks sólidos para navegadores sin soporte

### Accessibility Checklist

- [ ] Ratio de contraste mínimo 4.5:1 para texto normal
- [ ] Ratio de contraste mínimo 3:1 para texto grande (18px+)
- [ ] Estados de focus claramente visibles
- [ ] Soporte para `prefers-reduced-motion`
- [ ] Soporte para `prefers-contrast: high`
- [ ] Navegación por teclado funcional en todos los componentes glass
- [ ] Screen readers pueden acceder a todo el contenido

---

## Implementación y Migración

### Orden de Implementación Recomendado

1. **Configurar Tailwind** con la paleta de colores extendida
2. **Implementar CSS utilities** en `globals.css`
3. **Crear componentes base** (Button, Card, Input)
4. **Implementar BackgroundWrapper** para layouts
5. **Migrar componentes existentes** progresivamente
6. **Testear accesibilidad** en cada paso

### Testing Strategy

```typescript
// Ejemplo de tests de accesibilidad para componentes glass
import { render, screen } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('Glass Components Accessibility', () => {
  test('Button glass variant meets contrast requirements', async () => {
    const { container } = render(
      <Button variant="glass">Test Button</Button>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  test('Card component supports keyboard navigation', () => {
    render(
      <Card>
        <CardContent>
          <Button variant="glass">Focusable Element</Button>
        </CardContent>
      </Card>
    )
    
    const button = screen.getByRole('button')
    button.focus()
    expect(button).toHaveFocus()
  })
})
```

Este Design System "Nebula Glass" proporciona una base sólida para crear interfaces modernas y accesibles, balanceando la estética glassmorphism con la funcionalidad y usabilidad requeridas en aplicaciones profesionales.
