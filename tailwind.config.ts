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