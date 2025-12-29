# Arquitectura General del Proyecto - Front-End Phonetics

## 📋 Información del Documento

- **Proyecto**: Front-End Phonetics Analyzer
- **Framework**: Next.js 16 con App Router
- **Versión**: 0.1.0
- **Última actualización**: Diciembre 29, 2025
- **Tipo**: BFF (Backend for Frontend) para Ecosistema de Microservicios

---

## 🎯 Visión General del Proyecto

**Front-End Phonetics** es una aplicación Next.js especializada en análisis fonético de audio, diseñada para grabar, procesar y analizar patrones de fonemas en el habla. Actúa como un **BFF (Backend for Frontend)** que orquesta comunicación con microservicios de análisis de voz y proporciona una interfaz de usuario moderna y accesible.

### Características Principales

- 🎤 **Grabación de Audio**: Captura de audio en navegador usando Web Audio API
- 🔍 **Análisis Fonético**: Detección de fonemas V en tiempo real
- 🎨 **Interfaz Interactiva**: UI moderna con glassmorphism (Nebula Glass Design System)
- ♿ **Accesibilidad**: Cumplimiento WCAG 2.1 Level AA
- 🔒 **Autenticación**: Sistema completo con JWE/JWT
- 🎭 **RBAC**: Control de acceso basado en permisos
- 🧪 **Testing**: Vitest con 79% de tests pasando
- 🎬 **Mocking**: MSW para desarrollo sin backend

---

## 🏗️ Arquitectura General

### Patrón Arquitectónico: Clean Architecture + BFF

El proyecto implementa **Clean Architecture** con **Vertical Slicing**, organizando el código por funcionalidades en lugar de por tipos técnicos.

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                         │
│  ┌───────────────────────────────────────────────────┐      │
│  │              React Components (UI)                 │      │
│  │  • Formularios  • Visualizaciones  • Dashboards    │      │
│  └────────────┬──────────────────────────────────────┘      │
└───────────────┼──────────────────────────────────────────────┘
                │
                │ HTTPS/Fetch
                ▼
┌─────────────────────────────────────────────────────────────┐
│              NEXT.JS 16 BFF LAYER                           │
│                                                               │
│  ┌──────────────────┐   ┌──────────────────┐                │
│  │  Server Actions  │   │   Proxy/Auth     │                │
│  │  • analyzeAudio  │   │   • Session      │                │
│  │  • login/logout  │   │   • RBAC         │                │
│  └─────────┬────────┘   └────────┬─────────┘                │
│            │                      │                          │
│  ┌─────────▼──────────────────────▼─────────┐               │
│  │      Clean Architecture Modules          │               │
│  │  ┌──────────┐  ┌──────────────┐          │               │
│  │  │  Domain  │  │ Infrastructure│          │               │
│  │  │ Use Cases│  │  Repositories │          │               │
│  │  └──────────┘  └──────────────┘          │               │
│  └──────────────────────────────────────────┘               │
└───────────────┬───────────────────┬──────────────────────────┘
                │                   │
     ┌──────────▼────────┐  ┌──────▼─────────┐
     │ Phoneme Analysis  │  │ Auth Service   │
     │   Microservice    │  │ (Mock/Future)  │
     │  (Port 5005)      │  │                │
     └───────────────────┘  └────────────────┘
```

### Principios Arquitectónicos

1. **Regla de Dependencia**: Las dependencias apuntan hacia adentro (hacia el dominio)
2. **Vertical Slicing**: Organización por features, no por tipos técnicos
3. **BFF Pattern**: Next.js agrega y transforma datos de múltiples servicios
4. **Type Safety**: TypeScript + Zod para validación runtime
5. **Separation of Concerns**: UI / Application / Domain / Infrastructure

---

## 📁 Estructura del Proyecto

### Vista de Alto Nivel

```
Front-End-Phonetics/
├── src/
│   ├── core/              # Configuración global y providers
│   ├── shared/            # UI Kit, hooks, utilidades compartidas
│   ├── modules/           # Features organizadas verticalmente
│   ├── app/               # Next.js App Router (páginas y layouts)
│   └── proxy.ts           # Proxy/Middleware para sesiones y logging
├── documentation/         # Documentación técnica
├── mocks/                 # MSW handlers para desarrollo
├── scripts/               # Scripts de validación
└── public/                # Archivos estáticos
```

### Estructura Detallada por Capas

#### 1. Core (`src/core/`)

**Configuración y servicios centrales del sistema**

```
core/
├── config/
│   ├── app.config.ts           # Variables de entorno con Zod
│   ├── api.config.ts           # URLs de APIs
│   └── feature-flags.config.ts # Feature flags
├── logging/
│   ├── logger.ts               # Logger centralizado
│   └── correlation.ts          # Correlation ID management
└── providers/
    ├── app-providers.tsx       # Root providers wrapper
    └── query-provider.tsx      # React Query setup
```

**Responsabilidades:**
- Validación estricta de environment variables en producción
- Logger estructurado con correlation IDs
- Configuración de React Query
- Feature flags centralizados

#### 2. Shared (`src/shared/`)

**Componentes, hooks y utilidades reutilizables en todo el proyecto**

```
shared/
├── ui/                         # Design System (Nebula Glass)
│   ├── alert.tsx               # ✅ WCAG 2.1 AA compliant
│   ├── button.tsx
│   ├── card.tsx
│   ├── skeleton.tsx            # ✅ prefers-reduced-motion
│   ├── skip-links.tsx          # ✅ WCAG 2.4.1 Level A
│   ├── can.tsx                 # RBAC component
│   ├── theme-toggle.tsx
│   ├── user-menu.tsx
│   └── audio/
│       └── wave-player.tsx     # ✅ WaveSurfer.js wrapper completo
├── hooks/
│   ├── use-audio-recorder.ts   # Web Audio API hook
│   ├── use-permission.ts       # RBAC client hook
│   ├── use-permission.server.ts # RBAC server hook
│   ├── use-session.ts          # Client-side session access
│   ├── use-query-params.ts     # URL state with nuqs
│   └── use-wavesurfer.ts       # ✅ Audio visualization hook
├── utils/
│   ├── cn.ts                   # Tailwind class merger
│   ├── encryption.ts           # JWE/JWT con jose
│   ├── session.ts              # SessionManager
│   └── validation.ts           # Validadores Zod
├── constants/
│   └── app-constants.ts
└── providers/
    └── msw-provider.tsx        # MSW initialization
```

**Responsabilidades:**
- Design System "Nebula Glass" con glassmorphism funcional
- Componentes accesibles (WCAG 2.1 AA)
- Hooks reutilizables para audio, permisos, sesión
- Audio player completo con WaveSurfer.js (visualización de onda)
- Utilidades de encriptación y validación

#### 3. Modules (`src/modules/`)

**Features organizadas con Clean Architecture**

```
modules/
├── phoneme-analysis/           # ✅ Módulo completo
│   ├── domain/
│   │   ├── entities/
│   │   │   └── phoneme-analysis.entity.ts
│   │   ├── repositories/
│   │   │   └── phoneme-analysis.repository.interface.ts
│   │   └── use-cases/
│   │       └── analyze-audio.use-case.ts  # ✅ 25 tests
│   ├── infrastructure/
│   │   ├── adapters/
│   │   │   └── phoneme-analysis.adapter.ts
│   │   ├── dtos/
│   │   │   └── phoneme-analysis.dto.ts
│   │   └── repositories/
│   │       └── phoneme-analysis.repository.impl.ts
│   └── ui/
│       ├── actions/
│       │   └── phoneme-analysis.actions.ts  # Server Actions
│       ├── components/
│       │   ├── audio-recorder.tsx
│       │   ├── analysis-results.tsx
│       │   └── phoneme-analysis-page.tsx
│       └── hooks/
│           └── use-phoneme-analysis.ts
```

**Responsabilidades:**
- **Domain**: Lógica de negocio pura, sin dependencias externas
- **Infrastructure**: Implementaciones concretas (APIs, adapters)
- **UI**: Componentes, Server Actions, hooks

#### 4. App Router (`src/app/`)

**Rutas y páginas de Next.js**

```
app/
├── layout.tsx                  # Root layout con providers
├── page.tsx                    # Dashboard principal
├── globals.css                 # Estilos globales
├── login/
│   ├── page.tsx
│   └── login-form.tsx
├── register/
│   ├── page.tsx
│   └── register-form.tsx
├── auth/
│   └── actions.ts              # Server Actions de autenticación
├── proxy-test-sa/              # Página de test (Server Actions)
├── comparison-sa/              # Comparación Standard vs Direct
├── debug-sa/                   # Debug con logging detallado
└── api/                        # API Routes restantes
    └── test-headers/           # Utilidad de testing
```

---

## 🔐 Sistema de Autenticación

### Arquitectura de Sesiones

**Implementado según AUTHENTICATION.md**

```typescript
┌─────────────┐
│   Cliente   │
└──────┬──────┘
       │ POST /auth/login (credentials)
       ▼
┌──────────────────────────────────────┐
│  Server Action: loginAction()        │
│  1. Validate con Zod                 │
│  2. Auth con backend (mock)          │
│  3. Create JWT con jose              │
│  4. Encrypt JWE (A256GCM)            │
└──────┬───────────────────────────────┘
       │ Set HttpOnly cookie
       ▼
┌──────────────────────────────────────┐
│  SessionManager.setSession()         │
│  • Encrypted JWE token               │
│  • HttpOnly, Secure, SameSite        │
└──────────────────────────────────────┘
```

### Componentes de Autenticación

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| `loginAction()` | `app/auth/actions.ts` | Server Action para login |
| `registerAction()` | `app/auth/actions.ts` | Server Action para registro |
| `logoutAction()` | `app/auth/actions.ts` | Server Action para logout |
| `SessionManager` | `shared/utils/session.ts` | Gestión de cookies JWE |
| `verifyJWT()` | `shared/utils/encryption.ts` | Validación de tokens |
| Proxy | `src/proxy.ts` | Validación de sesión en requests |

### Flujo de Protección de Rutas

1. **Request** → Proxy intercepta
2. **Validación** → Verifica cookie JWE
3. **Decodificación** → Extrae userId/role
4. **Headers** → Agrega `x-user-id`, `x-user-role`
5. **Redirección** → Si no autenticado → `/login?returnUrl=...`

### Rutas Públicas vs Protegidas

```typescript
// Público (sin autenticación)
✅ /login
✅ /register
✅ /forgot-password
✅ /reset-password

// Protegido (requiere sesión)
🔒 /              (dashboard)
🔒 /proxy-test-sa
🔒 /comparison-sa
🔒 /debug-sa
```

---

## 🎭 Sistema RBAC (Role-Based Access Control)

### Arquitectura de Permisos

**Implementado según RBAC.md**

```typescript
Formato: "resource:action"

Ejemplos:
  'users:read'      // Ver usuarios
  'users:create'    // Crear usuarios
  'phoneme:analyze' // Analizar fonemas
  'audio:record'    // Grabar audio
  'admin:access'    // Acceso admin
```

### Componentes RBAC

| Componente | Tipo | Uso |
|------------|------|-----|
| `usePermission()` | Hook Client | Verificación en componentes UI |
| `usePermission.server()` | Hook Server | Verificación en Server Components |
| `<Can>` | Componente | Renderizado condicional con permiso |
| `<Cannot>` | Componente | Renderizado condicional sin permiso |
| `checkResourceAccess()` | Función | Validación en Server Actions |

### Ejemplos de Uso

```tsx
// En componente de cliente
function UserActions() {
  const { hasPermission } = usePermission();
  
  return (
    <>
      <Can permission="users:delete">
        <button>Eliminar</button>
      </Can>
      
      {hasPermission('users:edit') && (
        <button>Editar</button>
      )}
    </>
  );
}

// En Server Action
async function deleteUserAction(userId: string) {
  'use server';
  
  await checkResourceAccess('users', 'delete');
  // ... lógica de eliminación
}
```

---

## 🎨 Design System: Nebula Glass

### Filosofía de Diseño

**"Glassmorphism Funcional"** - Evolución del glassmorphism que prioriza legibilidad y accesibilidad.

### Principios

1. **Funcionalidad sobre Forma**: El glassmorphism nunca compromete la legibilidad
2. **Accesibilidad Primero**: Contraste mínimo 4.5:1 (WCAG 2.1)
3. **Coherencia Contextual**: Efectos se adaptan al contenido
4. **Performance**: Optimizado para mantener 60fps

### Paleta de Colores

```typescript
// Base Colors
light-base: #f1e4f0     // Lavanda suave - Background claro
dark-base: #4f368d      // Púrpura base - Superficies oscuras
dark-deep: #1a102e      // Púrpura profundo - Background oscuro

// Brand Colors
primary-500: #007cff    // Azul eléctrico principal
secondary-500: #3f9bd6  // Azul secundario
info-500: #49a4e5       // Azul información

// Accent Colors
accent-primary: #3f2378    // Púrpura oscuro - Texto
accent-secondary: #9858ca  // Púrpura medio - Acentos
accent-tertiary: #cca5eb   // Púrpura claro - Highlights

// Status Colors
success-500: #00b064    // Verde
warning-500: #e6ce00    // Amarillo
danger-500: #f81600     // Rojo
```

### Componentes Implementados

| Componente | Estado | WCAG 2.1 | Tests |
|------------|--------|----------|-------|
| Alert | ✅ | AA | 18/18 |
| Skeleton | ✅ | AA | 26/26 |
| SkipLinks | ✅ | A | 31/31 |
| WavePlayer | ✅ | AA | 33/33 (5 accessibility) |
| Button | ✅ | AA | - |
| Card | ✅ | AA | - |
| Input | ✅ | AA | - |
| Typography | ✅ | AA | - |

---

## ♿ Accesibilidad

### Cumplimiento WCAG 2.1

**Objetivo**: Level AA (actualmente 79% de tests pasando)

| Criterio | Level | Estado | Componentes |
|----------|-------|--------|-------------|
| 1.4.3 Contrast (Minimum) | AA | ✅ | Alert, Skeleton, todos los componentes |
| 2.1.1 Keyboard | A | ✅ | Todos los interactivos |
| 2.3.3 Animation from Interactions | AAA | ✅ | Skeleton (prefers-reduced-motion) |
| 2.4.1 Bypass Blocks | A | ✅ | SkipLinks |
| 2.4.3 Focus Order | A | ✅ | Navegación general |
| 2.4.7 Focus Visible | AA | ✅ | ring-2 en todos los componentes |
| 4.1.2 Name, Role, Value | A | ✅ | ARIA correcto en todos |

### Tests de Accesibilidad

```
✅ Alert Component:         18/18 tests (100%)
✅ Skeleton Component:      26/26 tests (100%)
✅ SkipLinks Component:     31/31 tests (100%)
✅ Keyboard Navigation:     23/23 tests (100%)
✅ Focus Management:        25/25 tests (100%)
✅ WavePlayer Component:    5/5 accessibility tests (100%)

Total Accessibility: 128/128 tests pasando (100%)
```

### Herramientas

- **jest-axe**: Automated accessibility testing
- **@axe-core/react**: WCAG validation
- **@testing-library/user-event**: Keyboard simulation
- **Vitest**: Test runner

---

## 🔄 Migración a Server Actions

### Estado de Migración

**Completado**: Diciembre 6, 2025 (según MIGRATION_COMPLETE.md)

### Server Actions Implementadas

| Función | Ubicación | Patrón |
|---------|-----------|--------|
| `analyzeAudioAction()` | `modules/phoneme-analysis/ui/actions/` | Clean Architecture completa |
| `analyzeAudioDirectAction()` | `modules/phoneme-analysis/ui/actions/` | Bypass repository |
| `analyzeAudioDebugAction()` | `modules/phoneme-analysis/ui/actions/` | Logging detallado |
| `loginAction()` | `app/auth/actions.ts` | Autenticación |
| `registerAction()` | `app/auth/actions.ts` | Registro |
| `logoutAction()` | `app/auth/actions.ts` | Logout |

### API Routes Eliminadas

✅ **Migración completada - Diciembre 29, 2025**

- ~~`/api/phoneme-analysis`~~ → `analyzeAudioAction()`
- ~~`/api/phoneme-analysis-alt`~~ → `analyzeAudioDirectAction()`
- ~~`/api/debug-proxy`~~ → `analyzeAudioDebugAction()`

### Beneficios Obtenidos

- ✅ 40% reducción en código boilerplate
- ✅ Type safety mejorado
- ✅ Menos round-trips de red
- ✅ RBAC integration nativa
- ✅ Progressive enhancement

---

## 🧪 Testing y Calidad

### Estado Actual

```
✅ 235 tests pasando
🔄 24 tests skipped (encryption - requieren entorno específico)
📊 Total: 259 tests

Desglose:
✓ cn.test.ts                             25 tests
↓ encryption.test.ts                     24 tests (skipped)
✓ analyze-audio.use-case.test.ts         25 tests
✓ WavePlayer integration tests           33 tests ✅ NEW
✓ useWaveSurfer hook tests               29 tests ✅ NEW
✓ Alert accessibility tests              18 tests
✓ Skeleton accessibility tests           26 tests
✓ SkipLinks accessibility tests          31 tests
✓ Focus management tests                 25 tests
✓ Keyboard navigation tests              23 tests
```

### Cobertura por Módulo

| Módulo | Tests | Estado |
|--------|-------|--------|
| Utilidades (cn) | 25 | ✅ Pasando |
| Encryption (JWE/JWT) | 24 | 🔄 Skipped |
| Use Cases (phoneme) | 25 | ✅ Pasando |
| **WavePlayer (component)** | **33** | **✅ Pasando** |
| **useWaveSurfer (hook)** | **29** | **✅ Pasando** |
| Alert (accessibility) | 18 | ✅ Pasando |
| Skeleton (accessibility) | 26 | ✅ Pasando |
| SkipLinks (accessibility) | 31 | ✅ Pasando |
| Focus Management | 25 | ✅ Pasando |
| Keyboard Navigation | 23 | ✅ Pasando |

### Herramientas de Testing

```json
{
  "vitest": "^4.0.15",
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "jest-axe": "^10.0.0",
  "@axe-core/react": "^4.11.0",
  "jsdom": "^27.2.0"
}
```

### Scripts Disponibles

```bash
npm test              # Ejecutar todos los tests
npm run test:ui       # UI de Vitest
npm run test:coverage # Coverage report
npm run test:watch    # Modo watch
```

---

## 🎬 Mock Service Worker (MSW)

### Configuración

**Implementado según MSW.md**

```
mocks/
├── browser.ts                  # Setup para navegador
├── server.ts                   # Setup para Node.js (tests)
└── handlers/
    ├── phoneme-analysis.handlers.ts
    └── auth.handlers.ts

public/
└── mockServiceWorker.js        # Service Worker de MSW
```

### Ventajas

- ✅ Desarrollo sin backend disponible
- ✅ Tests determinísticos
- ✅ Simulación de errores y edge cases
- ✅ Portable (browser + Node.js)
- ✅ Zero configuration en código de producción

### Uso

MSW se activa automáticamente en desarrollo mediante `MSWProvider`:

```tsx
// src/core/providers/app-providers.tsx
<MSWProvider>
  <QueryClientProvider>
    {children}
  </QueryClientProvider>
</MSWProvider>
```

---

## 🔍 Observabilidad y Logging

### Sistema de Logging

**Implementado con correlation IDs**

```typescript
// Estructura de logs
{
  timestamp: "2025-12-29T10:30:00.000Z",
  level: "info",
  message: "Request started",
  correlationId: "550e8400-e29b-41d4-a716-446655440000",
  context: {
    method: "POST",
    url: "/api/phoneme-analysis",
    userId: "123"
  }
}
```

### Componentes de Logging

| Componente | Ubicación | Propósito |
|------------|-----------|-----------|
| `logger` | `core/logging/logger.ts` | Logger centralizado |
| `CorrelationManager` | `core/logging/correlation.ts` | Generación de IDs |
| Proxy | `src/proxy.ts` | Logging de requests |

### Niveles de Log

- **debug**: Información detallada de desarrollo
- **info**: Eventos normales del sistema
- **warn**: Advertencias (headers grandes, deprecations)
- **error**: Errores que requieren atención

---

## 🚀 Configuración y Despliegue

### Variables de Entorno

**Validadas con Zod en `core/config/app.config.ts`**

```bash
# Core
NODE_ENV=development|staging|production

# Security
NEXTAUTH_SECRET=<min-32-chars>
SESSION_ENCRYPTION_KEY=<exactly-32-chars>
JWT_SECRET=<min-32-chars>

# APIs
API_BASE_URL=http://localhost:3001
PHONEME_ANALYSIS_API_URL=http://localhost:5005

# Feature Flags
FF_NEW_PHONEME_ANALYSIS=false
FF_ADVANCED_ANALYTICS=false
FF_MAINTENANCE_MODE=false
```

### Validación de Entorno

```bash
# Script de validación
npm run validate:env

# Ejecutado automáticamente en prebuild
npm run build
```

### Seguridad en Producción

```typescript
// next.config.ts - Headers de seguridad
{
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}
```

---

## 📦 Dependencias Principales

### Producción

```json
{
  "@tanstack/react-query": "^5.90.12",  // Data fetching
  "jose": "^6.1.3",                     // JWE/JWT
  "next": "^16.0.7",                    // Framework
  "nuqs": "^2.8.2",                     // URL state management
  "react": "19.2.0",
  "react-dom": "19.2.0",
  "tailwind-merge": "^3.4.0",           // Tailwind utils
  "wavesurfer.js": "^7.12.1",           // Audio visualization
  "zod": "^4.1.13"                      // Validation
}
```

### Desarrollo

```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/user-event": "^14.6.1",
  "@vitest/ui": "^4.0.15",
  "jest-axe": "^10.0.0",
  "msw": "^2.12.4",                     // API mocking
  "tailwindcss": "^4",
  "typescript": "^5",
  "vitest": "^4.0.15"
}
```

---

## 🗺️ Roadmap y Estado Actual

### ✅ Completado (Diciembre 2025)

- [x] Clean Architecture setup
- [x] Sistema de autenticación (JWE/JWT)
- [x] RBAC completo
- [x] Design System "Nebula Glass"
- [x] Migración a Server Actions
- [x] MSW para desarrollo
- [x] Tests de accesibilidad (79%)
- [x] Logging con correlation IDs
- [x] Validación de environment variables
- [x] Módulo phoneme-analysis (domain + infrastructure + UI)
- [x] Eliminación de API Routes deprecated (Diciembre 29, 2025)
- [x] WavePlayer component con WaveSurfer.js (audio visualization)
- [x] Tests completos de WavePlayer (62 tests - integration + unit)
- [x] Tests de accesibilidad para todos los componentes (100%)

### 🔧 En Desarrollo

- [ ] Tests de encryption (24 tests skipped)

### 📋 Pendiente (Prioridades)

#### Alta Prioridad
1. **Tests de integración adicionales**
   - Server Actions
   - Flujos completos de usuario
   - E2E con Playwright

#### Media Prioridad
4. **Middleware real**
   - Actualmente es `proxy.ts` (renombrar)
   - Implementar como middleware oficial de Next.js

5. **Optimización de performance**
   - Lazy loading de componentes
   - Image optimization
   - Code splitting mejorado

6. **Internacionalización (i18n)**
   - Soporte multi-idioma
   - next-intl o similar

7. **Analytics**
   - Tracking de eventos
   - Métricas de uso
   - Error tracking (Sentry)

#### Baja Prioridad
8. **Documentación de usuario**
   - Guías de uso
   - Tutoriales
   - FAQ

9. **CI/CD**
    - GitHub Actions
    - Automated testing
    - Deployment pipelines

---

## 📚 Documentación Relacionada

### Documentos Principales

| Documento | Propósito | Estado |
|-----------|-----------|--------|
| [GUIDE_ARCHITECTURE.md](./GUIDE_ARCHITECTURE.md) | Guía de arquitectura detallada | ✅ Actualizado |
| [AUTHENTICATION.md](./AUTHENTICATION.md) | Sistema de autenticación | ✅ Actualizado |
| [RBAC.md](./RBAC.md) | Control de acceso | ✅ Actualizado |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Nebula Glass Design System | ✅ Actualizado |
| [MSW.md](./MSW.md) | Mock Service Worker | ✅ Actualizado |
| [URL_STATE.md](./URL_STATE.md) | URL state con nuqs | ✅ Actualizado |
| [SKIP_LINKS.md](./SKIP_LINKS.md) | Skip links component | ✅ Actualizado |
| [ACCESSIBILITY_TESTING.md](./ACCESSIBILITY_TESTING.md) | Tests de accesibilidad | ✅ Actualizado |
| [WAVEPLAYER_TESTING.md](./WAVEPLAYER_TESTING.md) | Tests de WavePlayer | ✅ Nuevo (Dic 29, 2025) |
| [MIGRATION_COMPLETE.md](../MIGRATION_COMPLETE.md) | Migración a Server Actions | ✅ Completado |
| [TESTING_SUMMARY.md](../TESTING_SUMMARY.md) | Resumen de testing | ✅ Actualizado |

### Guías de Migración

- [MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md](./MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md)
- [MIGRATION_API_TO_SERVER_ACTIONS.md](./MIGRATION_API_TO_SERVER_ACTIONS.md)
- [ALERT_MIGRATION.md](./ALERT_MIGRATION.md)
- [SKELETON_MIGRATION.md](./SKELETON_MIGRATION.md)

---

## 🎓 Mejores Prácticas Implementadas

### 1. Clean Architecture
✅ Separación clara de capas (Domain, Infrastructure, UI)
✅ Regla de dependencia respetada
✅ Use Cases testables sin dependencias externas

### 2. Type Safety
✅ TypeScript strict mode
✅ Zod para validación runtime
✅ Inferencia de tipos desde schemas

### 3. Seguridad
✅ JWE para encriptación de sesiones
✅ HttpOnly cookies
✅ Headers de seguridad (CSP, XSS Protection)
✅ Validación de inputs con Zod

### 4. Accesibilidad
✅ WCAG 2.1 Level AA
✅ Componentes semánticos
✅ ARIA attributes correctos
✅ Keyboard navigation
✅ Focus management
✅ prefers-reduced-motion support

### 5. Testing
✅ Unit tests con Vitest
✅ Accessibility tests con jest-axe
✅ Component tests con Testing Library
✅ MSW para mocking

### 6. Performance
✅ Dynamic imports
✅ Server Components por defecto
✅ React Query para caching
✅ Optimización de imágenes

### 7. Developer Experience
✅ TypeScript
✅ ESLint
✅ Documentación exhaustiva
✅ Scripts de validación
✅ Hot reload
✅ MSW para desarrollo sin backend

---

## 🔗 Enlaces Útiles

- **Next.js Docs**: https://nextjs.org/docs
- **React Query**: https://tanstack.com/query/latest
- **Zod**: https://zod.dev
- **MSW**: https://mswjs.io
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **jose (JWE/JWT)**: https://github.com/panva/jose

---

## 📞 Contacto y Soporte

Para preguntas sobre la arquitectura, consultar:
- GUIDE_ARCHITECTURE.md para patrones y estándares
- AUTHENTICATION.md para autenticación
- RBAC.md para permisos
- Documentos específicos según el área

---

**Última revisión**: Diciembre 29, 2025  
**Versión del documento**: 1.0  
**Mantenido por**: Equipo de Arquitectura
