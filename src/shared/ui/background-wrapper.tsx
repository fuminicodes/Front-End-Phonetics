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