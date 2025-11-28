# Arquitectura del Proyecto Front-End-Phonetics

## Descripción General

El proyecto Front-End-Phonetics es una aplicación web desarrollada con Next.js que permite grabar audio y analizar fonemas usando una API externa. La aplicación está diseñada para procesar grabaciones de voz y determinar si contienen fonemas específicos (como el fonema 'V').

## Stack Tecnológico

- **Framework**: Next.js 16.0.4
- **Lenguaje**: TypeScript 5
- **UI**: React 19.2.0
- **Estilos**: Tailwind CSS 4
- **Linting**: ESLint con configuración Next.js

## Estructura del Proyecto

```
Front-End-Phonetics/
├── src/
│   ├── app/                    # App Router de Next.js 13+
│   │   ├── api/               # API Routes
│   │   │   ├── debug-proxy/
│   │   │   ├── phoneme-analysis/
│   │   │   ├── phoneme-analysis-alt/
│   │   │   └── test-headers/
│   │   ├── debug-test/        # Página de pruebas de debug
│   │   ├── field-test/        # Página de pruebas de campos
│   │   ├── header-test/       # Página de pruebas de headers
│   │   ├── proxy-comparison/  # Página de comparación de proxies
│   │   ├── proxy-test/        # Página de pruebas de proxy
│   │   ├── globals.css        # Estilos globales
│   │   ├── layout.tsx         # Layout raíz de la aplicación
│   │   └── page.tsx           # Página principal
│   ├── components/            # Componentes reutilizables
│   │   ├── AnalysisResults.tsx
│   │   └── AudioRecorder.tsx
│   ├── hooks/                 # Custom React Hooks
│   │   └── useAudioRecorder.ts
│   ├── services/              # Servicios para APIs externas
│   │   └── phonemeAnalysis.ts
│   ├── types/                 # Definiciones de tipos TypeScript
│   │   └── api.ts
│   ├── utils/                 # Utilidades y helpers
│   │   └── headerDiagnostics.ts
│   └── middleware.ts          # Middleware de Next.js
├── public/                    # Archivos estáticos
├── documentation/             # Documentación del proyecto
└── config files              # Archivos de configuración
```

## Arquitectura de Componentes

### 1. Página Principal (`src/app/page.tsx`)
- **Propósito**: Página principal que coordina la grabación y análisis de audio
- **Estado**: Maneja los resultados del análisis, errores y problemas de headers
- **Funcionalidades**:
  - Grabación de audio
  - Análisis de fonemas
  - Diagnóstico de headers
  - Limpieza de localStorage

### 2. Componente AudioRecorder (`src/components/AudioRecorder.tsx`)
- **Propósito**: Interfaz para grabar audio del micrófono
- **Props**: `onRecordingComplete`, `isAnalyzing`
- **Funcionalidades**:
  - Iniciar/detener grabación
  - Reproducir audio grabado
  - Limpiar grabación
  - Trigger del análisis

### 3. Hook useAudioRecorder (`src/hooks/useAudioRecorder.ts`)
- **Propósito**: Lógica de grabación de audio
- **API**: MediaRecorder Web API
- **Estado**: `isRecording`, `audioBlob`, `audioUrl`, `error`

### 4. Componente AnalysisResults (`src/components/AnalysisResults.tsx`)
- **Propósito**: Mostrar resultados del análisis de fonemas
- **Props**: Recibe `PhonemeAnalysisResponse`

## API Routes y Servicios

### 1. Proxy de Análisis de Fonemas (`src/app/api/phoneme-analysis/route.ts`)
- **Endpoint**: `/api/phoneme-analysis`
- **Método**: POST
- **Propósito**: Proxy hacia la API externa de análisis de fonemas
- **API Externa**: `http://localhost:5005/api/PhonemeRecognition/analyze-v`
- **Funcionalidades**:
  - Recibe archivos de audio via FormData
  - Reenvía la petición a la API externa
  - Maneja errores y respuestas

### 2. Servicio PhonemeAnalysisService (`src/services/phonemeAnalysis.ts`)
- **Propósito**: Cliente para el análisis de fonemas
- **Método**: `analyzeAudio(audioBlob, fileName)`
- **Manejo de errores**: Diferencia entre errores de cliente y servidor

### 3. Rutas de Debug y Testing
- `debug-proxy/`: Proxy alternativo para debugging
- `phoneme-analysis-alt/`: Endpoint alternativo de análisis
- `test-headers/`: Endpoint para probar headers HTTP

## Tipos de Datos

### PhonemeAnalysisResponse (`src/types/api.ts`)
```typescript
interface PhonemeAnalysisResponse {
  fileName?: string;
  isVPhoneme: boolean;
  confidence: number;
  duration: number;
  sampleRate: number;
  message?: string;
}
```

### ApiError
```typescript
interface ApiError {
  error: string;
  details?: ProblemDetails;
}
```

## Utilidades

### HeaderDiagnostics (`src/utils/headerDiagnostics.ts`)
- **Propósito**: Diagnosticar y limpiar problemas con headers HTTP
- **Funcionalidades**:
  - Detectar headers problemáticos
  - Limpiar datos de localStorage
  - Prevenir errores de headers grandes

## Configuración

### Next.js Configuration (`next.config.ts`)
- Configuración de headers de seguridad
- Políticas de caché
- Headers X-Frame-Options y X-Content-Type-Options

### ESLint y TypeScript
- Configuración estándar de Next.js
- TypeScript estricto habilitado
- Linting automático en desarrollo

## Flujo de Datos

1. **Grabación de Audio**:
   - Usuario inicia grabación → `useAudioRecorder` → MediaRecorder API
   - Audio se guarda como Blob → Estado del componente

2. **Análisis de Fonemas**:
   - AudioBlob → `PhonemeAnalysisService.analyzeAudio()`
   - FormData → `/api/phoneme-analysis` (proxy)
   - Proxy → API externa (`localhost:5005`)
   - Respuesta → `PhonemeAnalysisResponse` → UI

3. **Manejo de Errores**:
   - Errores de grabación → Estado del hook
   - Errores de API → Estado de la página principal
   - Errores de headers → `HeaderDiagnostics`

## Guías de Desarrollo

### Crear Nuevos Componentes

1. **Estructura del Archivo**:
```typescript
// src/components/NuevoComponente.tsx
'use client'; // Si usa hooks o estado

import React from 'react';

interface NuevoComponenteProps {
  // Definir props aquí
}

export const NuevoComponente: React.FC<NuevoComponenteProps> = ({
  // props destructuring
}) => {
  return (
    <div className="space-y-4 p-4">
      {/* JSX aquí */}
    </div>
  );
};
```

2. **Convenciones de Nomenclatura**:
   - Usar PascalCase para nombres de componentes
   - Usar camelCase para props
   - Usar kebab-case para clases CSS

3. **Importar en Páginas**:
```typescript
import { NuevoComponente } from '@/components/NuevoComponente';
```

### Crear Nuevos Endpoints de API

1. **Crear Route Handler**:
```typescript
// src/app/api/nuevo-endpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Lógica del endpoint
    const data = await request.json();
    
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Exportar otros métodos según necesidad
export async function GET(request: NextRequest) {
  // Lógica para GET
}
```

2. **Crear Servicio Cliente**:
```typescript
// src/services/nuevoServicio.ts
export class NuevoServicio {
  static async operacion(data: any) {
    const response = await fetch('/api/nuevo-endpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    return response.json();
  }
}
```

3. **Definir Tipos**:
```typescript
// src/types/api.ts
export interface NuevoTipoRequest {
  // Estructura de la petición
}

export interface NuevoTipoResponse {
  // Estructura de la respuesta
}
```

### Agregar Nuevas APIs Externas

1. **Crear Proxy Route**:
```typescript
// src/app/api/nueva-api-proxy/route.ts
export async function POST(request: NextRequest) {
  try {
    const requestData = await request.json();
    
    const response = await fetch('https://api-externa.com/endpoint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(requestData),
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error conectando con API externa' },
      { status: 500 }
    );
  }
}
```

2. **Variables de Entorno**:
```bash
# .env.local
API_KEY=tu_api_key_aqui
EXTERNAL_API_URL=https://api-externa.com
```

3. **Configurar en next.config.ts si es necesario**:
```typescript
const nextConfig: NextConfig = {
  env: {
    EXTERNAL_API_URL: process.env.EXTERNAL_API_URL,
  },
};
```

### Crear Custom Hooks

1. **Estructura del Hook**:
```typescript
// src/hooks/useNuevoHook.ts
'use client';

import { useState, useEffect } from 'react';

export const useNuevoHook = (parametro?: string) => {
  const [estado, setEstado] = useState<TipoEstado | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const operacion = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Lógica del hook
      const resultado = await algunaOperacion();
      setEstado(resultado);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return {
    estado,
    loading,
    error,
    operacion,
  };
};
```

### Crear Nuevas Páginas

1. **Página Simple**:
```typescript
// src/app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Nueva Página</h1>
      {/* Contenido de la página */}
    </main>
  );
}
```

2. **Página con Metadata**:
```typescript
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nueva Página - Phonetics Analyzer',
  description: 'Descripción de la nueva página',
};

export default function NuevaPagina() {
  // Componente de la página
}
```

3. **Página con Loading y Error**:
```typescript
// src/app/nueva-pagina/loading.tsx
export default function Loading() {
  return <div>Cargando...</div>;
}

// src/app/nueva-pagina/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Algo salió mal!</h2>
      <button onClick={reset}>Reintentar</button>
    </div>
  );
}
```

## Comandos de Desarrollo

### Instalación
```powershell
npm install
```

### Desarrollo
```powershell
npm run dev
```

### Construcción
```powershell
npm run build
npm start
```

### Linting
```powershell
npm run lint
```

### Ejecutar Servidor de Desarrollo con Task
```powershell
# Usar el task predefinido
# Ejecutar: Ctrl+Shift+P → "Tasks: Run Task" → "Dev Server"
```

## Mejores Prácticas

### Estructura de Archivos
- Un componente por archivo
- Nombres descriptivos y consistentes
- Separar lógica en hooks y servicios

### Manejo de Estado
- Usar hooks locales para estado simple
- Considerar Context API para estado global
- Evitar prop drilling excesivo

### Manejo de Errores
- Siempre manejar errores en operaciones async
- Mostrar mensajes de error user-friendly
- Logging apropiado para debugging

### Performance
- Usar `'use client'` solo cuando sea necesario
- Implementar loading states
- Optimizar images y assets

### TypeScript
- Definir tipos explícitos
- Evitar `any`
- Usar interfaces para objetos complejos

## Debugging y Testing

### Páginas de Testing Disponibles
- `/debug-test` - Debug general
- `/field-test` - Testing de campos
- `/header-test` - Testing de headers HTTP
- `/proxy-comparison` - Comparación de proxies
- `/proxy-test` - Testing de proxy

### Herramientas de Debug
- Console logs en API routes
- Header diagnostics utility
- Network tab en DevTools
- Next.js development mode

## Consideraciones de Seguridad

- Headers de seguridad configurados en `next.config.ts`
- Validación de entrada en API routes
- Manejo seguro de archivos de audio
- Limpieza de localStorage para prevenir ataques

## Próximos Pasos Sugeridos

1. Implementar tests unitarios y de integración
2. Agregar autenticación si es necesario
3. Implementar caching para mejores performance
4. Agregar más tipos de análisis de fonemas
5. Implementar persistencia de datos
6. Mejorar accesibilidad (a11y)
7. Agregar PWA capabilities