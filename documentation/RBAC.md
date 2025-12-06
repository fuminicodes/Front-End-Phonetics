# RBAC (Role-Based Access Control) System

## Descripción General

Este documento describe el sistema de permisos RBAC implementado en el proyecto. El sistema proporciona control de acceso basado en permisos a nivel de componentes UI y Server Actions.

## Arquitectura

El sistema RBAC se compone de tres capas principales:

1. **Context Layer**: `PermissionsProvider` - Propaga permisos desde el servidor al cliente
2. **Hook Layer**: `usePermission` - Funciones de verificación en cliente y servidor
3. **Component Layer**: `Can` / `Cannot` - Renderizado condicional basado en permisos

## Formato de Permisos

Los permisos siguen el formato: `resource:action`

### Ejemplos de permisos comunes:

```typescript
// Permisos de usuarios
'users:read'      // Ver usuarios
'users:create'    // Crear usuarios
'users:update'    // Actualizar usuarios
'users:delete'    // Eliminar usuarios

// Permisos de análisis fonético
'phoneme:analyze' // Realizar análisis
'phoneme:read'    // Ver análisis
'phoneme:delete'  // Eliminar análisis

// Permisos de audio
'audio:record'    // Grabar audio
'audio:upload'    // Subir archivos

// Permisos administrativos
'admin:access'    // Acceso a panel admin
'settings:manage' // Gestionar configuración
```

## Uso en el Cliente (UI Components)

### 1. Hook `usePermission`

El hook proporciona funciones para verificar permisos en componentes de cliente:

```typescript
'use client';
import { usePermission } from '@/shared/hooks/use-permission';

export function MyComponent() {
  const { 
    hasPermission, 
    hasResourceAccess,
    hasAnyPermission,
    hasAllPermissions 
  } = usePermission();
  
  // Verificar un solo permiso
  if (hasPermission('users:delete')) {
    // Mostrar botón de eliminar
  }
  
  // Verificar acceso a recurso con acción
  if (hasResourceAccess('phoneme', 'analyze')) {
    // Permitir análisis
  }
  
  // Verificar si tiene al menos uno de varios permisos
  if (hasAnyPermission(['users:update', 'users:delete'])) {
    // Mostrar opciones de edición
  }
  
  // Verificar si tiene todos los permisos
  if (hasAllPermissions(['phoneme:analyze', 'audio:record'])) {
    // Habilitar función completa
  }
  
  return <div>...</div>;
}
```

### 2. Componente `Can`

Renderizado condicional cuando el usuario **tiene** el permiso:

```typescript
import { Can } from '@/shared/ui';

export function UserActions() {
  return (
    <div>
      {/* Usando permiso directo */}
      <Can permission="users:delete">
        <button>Eliminar Usuario</button>
      </Can>
      
      {/* Usando recurso + acción */}
      <Can resource="phoneme" action="analyze">
        <button>Analizar Audio</button>
      </Can>
      
      {/* Requiere TODOS los permisos */}
      <Can 
        permissions={['phoneme:analyze', 'audio:record']}
        requireAll={true}
      >
        <ComplexFeature />
      </Can>
      
      {/* Requiere AL MENOS UNO */}
      <Can 
        permissions={['users:update', 'users:delete']}
        requireAll={false}
      >
        <EditOptions />
      </Can>
      
      {/* Con fallback personalizado */}
      <Can 
        permission="admin:access"
        fallback={<p>Acceso denegado</p>}
      >
        <AdminPanel />
      </Can>
    </div>
  );
}
```

### 3. Componente `Cannot`

Renderizado condicional cuando el usuario **NO tiene** el permiso (lógica inversa):

```typescript
import { Cannot } from '@/shared/ui';

export function RestrictedArea() {
  return (
    <div>
      {/* Mostrar mensaje si NO tiene permiso */}
      <Cannot permission="admin:access">
        <p>Esta área está restringida a administradores.</p>
      </Cannot>
      
      {/* Deshabilitar UI si NO tiene permiso */}
      <Cannot resource="phoneme" action="delete">
        <button disabled>Eliminar Análisis</button>
      </Cannot>
    </div>
  );
}
```

### 4. HOC `withPermission`

Higher-Order Component para proteger componentes completos:

```typescript
import { withPermission } from '@/shared/ui';

function AdminPanelComponent() {
  return <div>Panel de Administración</div>;
}

// Proteger componente con permiso
export const AdminPanel = withPermission(
  AdminPanelComponent,
  { permission: 'admin:access' }
);

// Con recurso + acción
export const AnalysisPanel = withPermission(
  AnalysisPanelComponent,
  { resource: 'phoneme', action: 'analyze' }
);

// Requiriendo múltiples permisos
export const SuperAdminPanel = withPermission(
  SuperAdminPanelComponent,
  { 
    permissions: ['admin:access', 'settings:manage'],
    requireAll: true 
  }
);

// Con fallback personalizado
export const ProtectedFeature = withPermission(
  FeatureComponent,
  { 
    permission: 'feature:access',
    fallback: <AccessDenied />
  }
);
```

## Uso en el Servidor (Server Actions)

### Verificación en Server Actions

```typescript
'use server';

import { 
  checkPermission, 
  checkResourceAccess,
  checkAnyPermission,
  checkAllPermissions,
  getUserPermissions
} from '@/shared/hooks/use-permission';

export async function deleteUserAction(userId: string) {
  // Verificar permiso simple
  const hasPermission = await checkPermission('users:delete');
  if (!hasPermission) {
    return { error: 'No tienes permiso para eliminar usuarios' };
  }
  
  // Ejecutar acción
  await deleteUser(userId);
  return { success: true };
}

export async function analyzeAudioAction(formData: FormData) {
  // Verificar acceso a recurso con acción
  const canAnalyze = await checkResourceAccess('phoneme', 'analyze');
  if (!canAnalyze) {
    return { error: 'No tienes permiso para analizar audio' };
  }
  
  // Ejecutar análisis
  const result = await performAnalysis(formData);
  return { success: true, result };
}

export async function adminAction() {
  // Verificar múltiples permisos (requiere AL MENOS UNO)
  const isAuthorized = await checkAnyPermission([
    'admin:access',
    'superadmin:access'
  ]);
  
  if (!isAuthorized) {
    return { error: 'Acceso denegado' };
  }
  
  // Ejecutar acción administrativa
  return { success: true };
}

export async function complexAction() {
  // Verificar múltiples permisos (requiere TODOS)
  const hasAll = await checkAllPermissions([
    'phoneme:analyze',
    'audio:record',
    'results:export'
  ]);
  
  if (!hasAll) {
    return { error: 'Necesitas permisos completos para esta acción' };
  }
  
  // Ejecutar acción compleja
  return { success: true };
}

export async function getPermissionsAction() {
  // Obtener todos los permisos del usuario actual
  const permissions = await getUserPermissions();
  return { permissions };
}
```

## Configuración Inicial

### 1. Provider en el Layout

El `PermissionsProvider` debe envolver la aplicación en `app/layout.tsx`:

```typescript
import { PermissionsProvider } from '@/shared/providers/permissions-provider';
import { SessionManager } from '@/shared/utils/session';

export default async function RootLayout({ children }) {
  const session = await SessionManager.getSession();
  
  return (
    <html>
      <body>
        <AppProviders>
          <PermissionsProvider 
            permissions={session?.permissions || []}
            userId={session?.userId}
            email={session?.email}
          >
            {children}
          </PermissionsProvider>
        </AppProviders>
      </body>
    </html>
  );
}
```

### 2. Permisos en la Sesión

Los permisos deben incluirse al crear la sesión de usuario (por ejemplo, al hacer login):

```typescript
// En auth/actions.ts
await SessionManager.setSession({
  userId: user.id,
  email: user.email,
  permissions: [
    'phoneme:analyze',
    'phoneme:read',
    'audio:record',
    'users:read'
  ],
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).getTime(),
});
```

## Patrones Comunes

### 1. Botón con Permiso

```typescript
<Can permission="users:delete">
  <button onClick={handleDelete} className="btn-danger">
    Eliminar
  </button>
</Can>
```

### 2. Navegación Condicional

```typescript
export function Navigation() {
  return (
    <nav>
      <Link href="/">Inicio</Link>
      <Link href="/phoneme-analysis">Análisis</Link>
      
      <Can permission="admin:access">
        <Link href="/admin">Admin</Link>
      </Can>
      
      <Can permission="settings:manage">
        <Link href="/settings">Configuración</Link>
      </Can>
    </nav>
  );
}
```

### 3. Feature Flags + Permisos

```typescript
<FeatureFlag flag="newAnalysisEngine">
  <Can resource="phoneme" action="analyze">
    <NewAnalysisButton />
  </Can>
</FeatureFlag>
```

### 4. Formulario con Acciones Condicionales

```typescript
export function UserForm({ user }) {
  const { hasPermission } = usePermission();
  
  return (
    <form>
      <input name="email" defaultValue={user.email} />
      <input name="name" defaultValue={user.name} />
      
      <Can permission="users:update">
        <button type="submit">Guardar</button>
      </Can>
      
      <Can permission="users:delete">
        <button 
          type="button" 
          onClick={handleDelete}
          className="btn-danger"
        >
          Eliminar
        </button>
      </Can>
    </form>
  );
}
```

### 5. Tabla con Acciones Dinámicas

```typescript
export function UsersTable({ users }) {
  const { hasPermission } = usePermission();
  
  const canEdit = hasPermission('users:update');
  const canDelete = hasPermission('users:delete');
  
  return (
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Nombre</th>
          {(canEdit || canDelete) && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.email}</td>
            <td>{user.name}</td>
            {(canEdit || canDelete) && (
              <td>
                <Can permission="users:update">
                  <button onClick={() => handleEdit(user)}>Editar</button>
                </Can>
                <Can permission="users:delete">
                  <button onClick={() => handleDelete(user)}>Eliminar</button>
                </Can>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

## Debugging

### Ver permisos del usuario actual

```typescript
'use client';
import { usePermission } from '@/shared/hooks/use-permission';

export function DebugPermissions() {
  const { permissions } = usePermission();
  
  return (
    <pre>
      {JSON.stringify(permissions, null, 2)}
    </pre>
  );
}
```

### Logging en Server Actions

```typescript
import { getUserPermissions } from '@/shared/hooks/use-permission';
import { logger } from '@/core/logging/logger';

export async function someAction() {
  const permissions = await getUserPermissions();
  
  await logger.info('Action executed', {
    permissions,
    action: 'someAction'
  });
}
```

## Mejores Prácticas

1. **Naming Convention**: Usa formato `resource:action` consistentemente
2. **Granularidad**: Define permisos específicos en lugar de permisos amplios
3. **Defense in Depth**: Verifica permisos tanto en UI como en Server Actions
4. **Fallbacks**: Proporciona mensajes claros cuando se deniegue acceso
5. **Logging**: Registra intentos de acceso denegado para auditoría
6. **Performance**: `usePermission` memoriza resultados, úsalo sin preocuparte por re-renders

## Ejemplos de Roles Comunes

```typescript
// Usuario básico
const basicUserPermissions = [
  'phoneme:read',
  'audio:record',
  'profile:update'
];

// Usuario premium
const premiumUserPermissions = [
  ...basicUserPermissions,
  'phoneme:analyze',
  'results:export',
  'audio:upload'
];

// Administrador
const adminPermissions = [
  ...premiumUserPermissions,
  'users:read',
  'users:update',
  'users:delete',
  'admin:access',
  'settings:manage'
];

// Super Admin
const superAdminPermissions = [
  ...adminPermissions,
  'system:configure',
  'logs:access',
  'superadmin:access'
];
```

## Referencias

- **Hook**: `src/shared/hooks/use-permission.ts`
- **Components**: `src/shared/ui/can.tsx`
- **Provider**: `src/shared/providers/permissions-provider.tsx`
- **Session**: `src/shared/utils/session.ts`
- **Ejemplo de uso**: `src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts`
