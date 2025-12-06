# Mock Service Worker (MSW) Configuration

## Descripción General

Este proyecto utiliza **MSW (Mock Service Worker)** para interceptar peticiones de red durante el desarrollo y testing. MSW permite desarrollar y probar la aplicación sin depender de servicios backend externos, mejorando la experiencia de desarrollo y la confiabilidad de los tests.

## ¿Por qué MSW?

### Ventajas

1. **Development Sin Backend**: Desarrolla sin esperar a que el backend esté listo
2. **Testing Confiable**: Tests determinísticos sin dependencias externas
3. **Simulación Realista**: Intercepta peticiones a nivel de Service Worker (navegador)
4. **Zero Configuration**: No requiere cambios en el código de producción
5. **Escenarios Complejos**: Simula errores, delays, y edge cases fácilmente
6. **Portable**: Funciona en browser y Node.js (tests)

### Cuándo Usar MSW

✅ **SÍ usar para:**
- Desarrollo local sin backend
- Unit y integration tests
- Simular errores y edge cases
- Demostrar funcionalidades
- Desarrollo paralelo frontend/backend

❌ **NO usar para:**
- Producción (deshabilitado automáticamente)
- Tests end-to-end contra backend real
- Performance testing del backend

## Instalación

MSW ya está instalado y configurado en el proyecto:

```json
{
  "devDependencies": {
    "msw": "^2.7.0"
  },
  "msw": {
    "workerDirectory": "public"
  }
}
```

## Estructura de Archivos

```
mocks/
├── browser.ts                          # Setup del worker para navegador
├── server.ts                           # Setup del worker para Node.js (tests)
└── handlers/
    ├── phoneme-analysis.handlers.ts    # Handlers para análisis fonético
    └── auth.handlers.ts                # Handlers para autenticación

public/
└── mockServiceWorker.js                # Service Worker generado por MSW

src/
└── shared/
    └── providers/
        └── msw-provider.tsx            # Provider para inicializar MSW
```

## Configuración

### 1. MSW Provider

El `MSWProvider` se encarga de inicializar MSW solo en desarrollo:

```tsx
// src/shared/providers/msw-provider.tsx
'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const initMSW = async () => {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
        });
        setMswReady(true);
      };
      initMSW();
    } else {
      setMswReady(true);
    }
  }, []);

  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return <div>Initializing development environment...</div>;
  }

  return <>{children}</>;
}
```

### 2. Integración en App

El provider está integrado en `app-providers.tsx`:

```tsx
// src/core/providers/app-providers.tsx
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ThemeProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </MSWProvider>
  );
}
```

## Crear Handlers

### Handler Básico

```typescript
// mocks/handlers/example.handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const exampleHandlers = [
  // GET request
  http.get('http://localhost:5005/api/users', async () => {
    await delay(500); // Simulate network delay
    
    return HttpResponse.json({
      users: [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ],
    });
  }),

  // POST request
  http.post('http://localhost:5005/api/users', async ({ request }) => {
    const body = await request.json();
    await delay(800);
    
    return HttpResponse.json({
      success: true,
      user: { id: 3, ...body },
    }, { status: 201 });
  }),

  // Error response
  http.delete('http://localhost:5005/api/users/:id', () => {
    return HttpResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }),
];
```

### Handler con FormData

```typescript
import { http, HttpResponse, delay } from 'msw';

export const uploadHandlers = [
  http.post('http://localhost:5005/api/upload', async ({ request }) => {
    await delay(1000);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const metadata = formData.get('metadata') as string;
    
    if (!file) {
      return HttpResponse.json(
        { error: 'File required' },
        { status: 400 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      fileId: `file_${Date.now()}`,
      fileName: file.name,
      size: file.size,
      metadata: JSON.parse(metadata || '{}'),
    });
  }),
];
```

### Handler Dinámico

```typescript
import { http, HttpResponse } from 'msw';

// Mock database
const users = new Map([
  [1, { id: 1, name: 'John', email: 'john@example.com' }],
  [2, { id: 2, name: 'Jane', email: 'jane@example.com' }],
]);

export const crudHandlers = [
  // GET /users
  http.get('http://localhost:5005/api/users', () => {
    return HttpResponse.json({
      users: Array.from(users.values()),
    });
  }),

  // GET /users/:id
  http.get('http://localhost:5005/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = users.get(Number(id));
    
    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ user });
  }),

  // POST /users
  http.post('http://localhost:5005/api/users', async ({ request }) => {
    const body = await request.json();
    const newUser = {
      id: users.size + 1,
      ...body,
    };
    
    users.set(newUser.id, newUser);
    
    return HttpResponse.json(
      { user: newUser },
      { status: 201 }
    );
  }),

  // PUT /users/:id
  http.put('http://localhost:5005/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const body = await request.json();
    const user = users.get(Number(id));
    
    if (!user) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    const updatedUser = { ...user, ...body };
    users.set(Number(id), updatedUser);
    
    return HttpResponse.json({ user: updatedUser });
  }),

  // DELETE /users/:id
  http.delete('http://localhost:5005/api/users/:id', ({ params }) => {
    const { id } = params;
    const deleted = users.delete(Number(id));
    
    if (!deleted) {
      return HttpResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({ success: true });
  }),
];
```

## Handlers Existentes

### 1. Phoneme Analysis Handlers

Ubicación: `mocks/handlers/phoneme-analysis.handlers.ts`

```typescript
// Endpoints disponibles:
- POST http://localhost:5005/api/PhonemeRecognition/analyze-v
  // Análisis normal con respuesta mockada
  
- POST http://localhost:5005/api/PhonemeRecognition/analyze-slow
  // Simula respuesta lenta (5 segundos)
  
- POST http://localhost:5005/api/PhonemeRecognition/analyze-error
  // Simula error del servidor (500)
  
- POST http://localhost:5005/api/PhonemeRecognition/analyze-unauthorized
  // Simula error de autorización (401)
```

### 2. Authentication Handlers

Ubicación: `mocks/handlers/auth.handlers.ts`

```typescript
// Usuarios de prueba:
const mockUsers = [
  {
    email: 'demo@ejemplo.com',
    password: 'password',
    permissions: ['phoneme:analyze', 'phoneme:read', 'audio:record'],
  },
  {
    email: 'admin@ejemplo.com',
    password: 'admin123',
    permissions: ['admin:access', 'users:delete', ...],
  },
  {
    email: 'premium@ejemplo.com',
    password: 'premium123',
    permissions: ['results:export', ...],
  },
];

// Endpoints:
- POST http://localhost:5005/api/auth/login
- POST http://localhost:5005/api/auth/register
- POST http://localhost:5005/api/auth/refresh
- POST http://localhost:5005/api/auth/logout
- GET  http://localhost:5005/api/auth/me
```

## Agregar Nuevos Handlers

### Paso 1: Crear el archivo de handlers

```typescript
// mocks/handlers/products.handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const productHandlers = [
  http.get('http://localhost:5005/api/products', async () => {
    await delay(500);
    return HttpResponse.json({
      products: [
        { id: 1, name: 'Product 1', price: 99.99 },
        { id: 2, name: 'Product 2', price: 149.99 },
      ],
    });
  }),
];
```

### Paso 2: Registrar en browser.ts

```typescript
// mocks/browser.ts
import { setupWorker } from 'msw/browser';
import { phonemeAnalysisHandlers } from './handlers/phoneme-analysis.handlers';
import { authHandlers } from './handlers/auth.handlers';
import { productHandlers } from './handlers/products.handlers'; // ⬅️ Import

const handlers = [
  ...phonemeAnalysisHandlers,
  ...authHandlers,
  ...productHandlers, // ⬅️ Add
];

export const worker = setupWorker(...handlers);
```

### Paso 3: Usar en tu código

```typescript
// No hay cambios necesarios en el código
// MSW intercepta automáticamente las peticiones
const response = await fetch('http://localhost:5005/api/products');
const data = await response.json();
```

## Simular Escenarios

### Delay de Red

```typescript
import { delay } from 'msw';

http.get('/api/data', async () => {
  await delay(3000); // 3 segundos
  return HttpResponse.json({ data: [] });
});
```

### Errores Aleatorios

```typescript
http.get('/api/flaky', () => {
  const shouldFail = Math.random() > 0.7; // 30% de fallos
  
  if (shouldFail) {
    return HttpResponse.json(
      { error: 'Random failure' },
      { status: 500 }
    );
  }
  
  return HttpResponse.json({ success: true });
});
```

### Rate Limiting

```typescript
let requestCount = 0;
const RATE_LIMIT = 5;
const WINDOW_MS = 60000; // 1 minuto

setInterval(() => { requestCount = 0; }, WINDOW_MS);

http.get('/api/protected', () => {
  requestCount++;
  
  if (requestCount > RATE_LIMIT) {
    return HttpResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  return HttpResponse.json({ data: 'Success' });
});
```

### Respuestas Condicionales

```typescript
http.post('/api/login', async ({ request }) => {
  const { email, password } = await request.json();
  
  // Simular diferentes respuestas según credenciales
  if (email === 'admin@test.com' && password === 'admin') {
    return HttpResponse.json({
      user: { email, role: 'admin' },
      token: 'admin_token',
    });
  }
  
  if (password === 'wrong') {
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    );
  }
  
  return HttpResponse.json({
    user: { email, role: 'user' },
    token: 'user_token',
  });
});
```

## Debugging

### Ver Peticiones Interceptadas

MSW muestra logs en la consola del navegador:

```
[MSW] Mocking enabled.
[MSW] 17:29:34 GET http://localhost:5005/api/users (200 OK)
[MSW] 17:29:35 POST http://localhost:5005/api/login (200 OK)
```

### Configurar Logging

```typescript
// mocks/browser.ts
worker.start({
  onUnhandledRequest: 'warn', // 'bypass' | 'warn' | 'error'
});
```

### Deshabilitar MSW Temporalmente

```typescript
// En el navegador (DevTools Console)
await worker.stop();

// Para reactivar
await worker.start();
```

### Ver Handlers Activos

```typescript
// En el navegador
console.log(worker.listHandlers());
```

## Testing

### Setup para Tests

```typescript
// mocks/server.ts
import { setupServer } from 'msw/node';
import { phonemeAnalysisHandlers } from './handlers/phoneme-analysis.handlers';
import { authHandlers } from './handlers/auth.handlers';

export const server = setupServer(...phonemeAnalysisHandlers, ...authHandlers);
```

### Usar en Tests

```typescript
// tests/setup.ts
import { server } from '@/mocks/server';

// Establecer MSW antes de todos los tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

// Reset handlers después de cada test
afterEach(() => server.resetHandlers());

// Limpiar después de todos los tests
afterAll(() => server.close());
```

### Override Handlers en Tests

```typescript
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

test('handles server error', async () => {
  server.use(
    http.get('http://localhost:5005/api/users', () => {
      return HttpResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
    })
  );

  // Tu test aquí
  const response = await fetchUsers();
  expect(response.error).toBe('Internal Server Error');
});
```

## Mejores Prácticas

### 1. Organización de Handlers

```typescript
// ✅ BIEN: Separar por dominio/recurso
mocks/
  handlers/
    auth.handlers.ts
    users.handlers.ts
    products.handlers.ts
    orders.handlers.ts

// ❌ MAL: Todo en un archivo
mocks/
  handlers.ts (1000+ líneas)
```

### 2. Usar Delays Realistas

```typescript
// ✅ BIEN: Simular delays reales
await delay(500); // Peticiones rápidas
await delay(2000); // Peticiones lentas

// ❌ MAL: Sin delays o muy largos
await delay(0); // Poco realista
await delay(10000); // Demasiado lento
```

### 3. Respuestas Consistentes con el Backend

```typescript
// ✅ BIEN: Usar los mismos tipos/DTOs
return HttpResponse.json({
  analysis_id: string,
  accuracy_score: number,
  // ... mismo formato que backend
});

// ❌ MAL: Formato diferente
return HttpResponse.json({
  id: string,
  score: number,
  // ... estructura diferente
});
```

### 4. Simular Edge Cases

```typescript
// Casos a considerar:
- Respuestas vacías
- Listas con muchos elementos (paginación)
- Errores de validación
- Timeouts
- Rate limiting
- Datos incompletos
- Caracteres especiales
```

### 5. Documentar Comportamiento Mock

```typescript
/**
 * Mock handler for user login
 * 
 * Test users:
 * - demo@ejemplo.com / password (regular user)
 * - admin@ejemplo.com / admin123 (admin)
 * 
 * Simulates 800ms network delay
 * Returns 401 for invalid credentials
 */
http.post('/api/login', async ({ request }) => {
  // ...
});
```

## Troubleshooting

### MSW no intercepta peticiones

**Problema**: Las peticiones van al servidor real

**Solución**:
1. Verificar que `mockServiceWorker.js` está en `public/`
2. Verificar que MSWProvider está en el árbol de componentes
3. Verificar que el URL en el handler coincide exactamente
4. Verificar que estás en modo development

### Service Worker no se registra

**Problema**: Error en consola sobre Service Worker

**Solución**:
```bash
# Reinicializar MSW
npx msw init public/ --save
```

### Conflictos con otros Service Workers

**Problema**: Otro SW interfiere con MSW

**Solución**:
```typescript
worker.start({
  serviceWorker: {
    url: '/custom-worker.js', // Usar nombre diferente
  },
});
```

### Handlers no se actualizan

**Problema**: Cambios en handlers no se reflejan

**Solución**:
1. Hacer hard refresh (Ctrl + Shift + R)
2. Limpiar caché del navegador
3. Reiniciar dev server

## Comandos Útiles

```bash
# Inicializar MSW (ya hecho)
npx msw init public/ --save

# Verificar versión
npm list msw

# Actualizar MSW
npm install msw@latest --save-dev
```

## Recursos

- **Documentación oficial**: https://mswjs.io/docs/
- **GitHub**: https://github.com/mswjs/msw
- **Ejemplos**: https://github.com/mswjs/examples
- **Handlers en el proyecto**:
  - `mocks/handlers/phoneme-analysis.handlers.ts`
  - `mocks/handlers/auth.handlers.ts`
- **Provider**: `src/shared/providers/msw-provider.tsx`
- **Setup**: `mocks/browser.ts`

## Notas Adicionales

- **Producción**: MSW está automáticamente deshabilitado en builds de producción
- **Performance**: MSW no afecta el performance en producción (código no incluido)
- **Browser Support**: Funciona en todos los navegadores modernos con Service Worker API
- **SSR**: MSW no intercepta peticiones en el servidor (Next.js SSR), solo en el navegador

## Estado Actual

✅ MSW configurado y funcionando
✅ Handlers para phoneme analysis
✅ Handlers para autenticación
✅ Provider integrado en app
✅ Service Worker inicializado
✅ Solo habilitado en development
