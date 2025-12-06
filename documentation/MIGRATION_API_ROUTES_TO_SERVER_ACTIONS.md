# MIGRATION_API_ROUTES_TO_SERVER_ACTIONS.md

## Migración de API Routes a Server Actions - Phoneme Analysis

### ✅ Estado: COMPLETADO
**Fecha:** Diciembre 2024  
**Versión:** 1.0

---

## 📋 Resumen de Cambios

Se ha completado la migración de las API Routes del módulo de análisis de fonemas a **Server Actions**, siguiendo las mejores prácticas de Next.js 16 y Clean Architecture.

### API Routes Deprecadas ❌

Las siguientes API Routes han sido marcadas como **deprecated** y serán removidas en futuras versiones:

| API Route | Estado | Reemplazo |
|-----------|--------|-----------|
| `/api/phoneme-analysis` | 🔴 Deprecated | `analyzeAudioAction()` |
| `/api/phoneme-analysis-alt` | 🔴 Deprecated | `analyzeAudioDirectAction()` |
| `/api/debug-proxy` | 🔴 Deprecated | `analyzeAudioDebugAction()` |

### Server Actions Implementadas ✅

| Server Action | Ubicación | Descripción |
|---------------|-----------|-------------|
| `analyzeAudioAction()` | `src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts` | Análisis estándar con Clean Architecture completa |
| `analyzeAudioDirectAction()` | `src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts` | Análisis directo (bypass repository) |
| `analyzeAudioDebugAction()` | `src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts` | Análisis con logging detallado para debugging |

---

## 🚀 Guía de Migración

### Antes (API Route) ❌

```tsx
'use client';

export default function AnalysisPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/phoneme-analysis', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Analysis failed');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="file" name="audio" accept="audio/*" />
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze'}
      </button>
    </form>
  );
}
```

### Después (Server Action) ✅

```tsx
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { analyzeAudioAction } from '@/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Analyzing...' : 'Analyze'}
    </button>
  );
}

export default function AnalysisPage() {
  const initialState = { errors: {}, success: false };
  const [state, formAction] = useFormState(analyzeAudioAction, initialState);

  return (
    <div>
      <form action={formAction}>
        <input type="file" name="audio" accept="audio/*" required />
        <input type="text" name="expectedText" placeholder="Expected text" />
        <select name="analysisType">
          <option value="pronunciation">Pronunciation</option>
          <option value="vowel">Vowel</option>
          <option value="consonant">Consonant</option>
        </select>
        <SubmitButton />
      </form>

      {state.success && state.result && (
        <div>
          <h2>✅ Analysis Successful</h2>
          <p>Accuracy: {state.result.accuracy}%</p>
          <p>Phonemes: {state.result.phonemeCount}</p>
        </div>
      )}

      {state.errors?._form && (
        <div>
          <h2>❌ Error</h2>
          {state.errors._form.map((error, idx) => (
            <p key={idx}>{error}</p>
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 🎯 Ventajas de Server Actions

### 1. **Menos Código Boilerplate**
- ❌ No más `fetch()` manual
- ❌ No más `useState` para loading
- ❌ No más manejo manual de errores HTTP
- ✅ Hooks nativos: `useFormState`, `useFormStatus`

### 2. **Type Safety Mejorado**
```typescript
// Server Action con tipos automáticos
const [state, formAction] = useFormState(analyzeAudioAction, initialState);
// state es automáticamente tipado como AnalyzeAudioActionState
```

### 3. **Progressive Enhancement**
Las Server Actions funcionan **sin JavaScript** habilitado en el navegador.

### 4. **Integración con Formularios**
```tsx
<form action={formAction}> {/* No necesita onSubmit handler */}
```

### 5. **Validación Integrada**
```typescript
// En la Server Action
const validatedFields = AnalyzeAudioFormSchema.safeParse({
  email: formData.get('email'),
  // ...
});

if (!validatedFields.success) {
  return {
    errors: validatedFields.error.flatten().fieldErrors,
  };
}
```

### 6. **Mejor Manejo de Errores**
Los errores se devuelven en la estructura de estado, no requieren try-catch en el cliente.

### 7. **Redirección Automática**
```typescript
// En Server Action
if (success) {
  redirect('/dashboard'); // Funciona naturalmente
}
```

---

## 📊 Comparación de Implementaciones

### Standard Action (Recomendada) ✅

**Archivo:** `analyzeAudioAction()`

**Características:**
- ✅ Clean Architecture completa
- ✅ Usa Use Case layer
- ✅ Repository Pattern
- ✅ Adapter Pattern
- ✅ Validación de negocio
- ✅ Alta testabilidad
- ✅ Alta mantenibilidad

**Cuándo usar:**
- Aplicaciones de producción
- Código que requiere tests
- Lógica de negocio compleja
- Proyectos que siguen Clean Architecture

### Direct Action (Alternativa) ⚡

**Archivo:** `analyzeAudioDirectAction()`

**Características:**
- ⚡ Llamada directa a API externa
- ⚡ Bypasses repository layer
- ⚡ Menos abstracción
- ⚡ Más rápida
- ⚠️ Menos testeable
- ⚠️ Menos mantenible

**Cuándo usar:**
- Prototipos rápidos
- Endpoints simples sin lógica de negocio
- Cuando el rendimiento es crítico
- Testing/debugging temporal

### Debug Action (Debugging) 🐛

**Archivo:** `analyzeAudioDebugAction()`

**Características:**
- 🔍 Logging detallado
- 🔍 Inspección de FormData
- 🔍 Tracking de requests/responses
- 🔍 Stack traces completos
- 🔍 Debugging information incluida

**Cuándo usar:**
- Debugging de problemas de integración
- Análisis de FormData
- Troubleshooting de API externa
- Desarrollo y testing

---

## 🧪 Páginas de Prueba

Se han creado nuevas páginas para probar las Server Actions:

### 1. Proxy Test (Server Action)
**URL:** `/proxy-test-sa`  
**Descripción:** Test básico de Server Action estándar  
**Reemplaza:** `/proxy-test`

### 2. Comparison (Server Actions)
**URL:** `/comparison-sa`  
**Descripción:** Comparación lado a lado de Standard vs Direct Action  
**Reemplaza:** `/proxy-comparison`

### 3. Debug (Server Action)
**URL:** `/debug-sa`  
**Descripción:** Debug detallado con logging completo  
**Reemplaza:** `/debug-test`

---

## 🔄 Plan de Depreciación

### Fase 1: Deprecación (ACTUAL) ⚠️
- ✅ Server Actions implementadas
- ✅ Páginas de prueba creadas
- ✅ API Routes marcadas como deprecated
- ✅ Warnings en logs cuando se usan API Routes

### Fase 2: Convivencia (1-2 sprints) 🔶
- Migrar gradualmente todos los componentes
- Mantener API Routes para backward compatibility
- Documentar todas las migraciones

### Fase 3: Eliminación (Q1 2026) 🗑️
- Remover completamente las API Routes
- Limpiar código deprecated
- Actualizar documentación

---

## 📝 Checklist de Migración

Para cada componente que usa API Routes:

- [ ] Identificar el componente que hace fetch a API Route
- [ ] Importar la Server Action correspondiente
- [ ] Reemplazar `useState` + `fetch` con `useFormState`
- [ ] Agregar `useFormStatus` para loading states
- [ ] Cambiar formulario de `onSubmit` a `action`
- [ ] Actualizar manejo de errores para usar `state.errors`
- [ ] Probar funcionalidad completa
- [ ] Verificar loading states
- [ ] Verificar error handling
- [ ] Remover código obsoleto

---

## 🛠️ Troubleshooting

### Error: "Server Action not found"
**Solución:** Asegúrate de que el archivo tenga `'use server'` en la primera línea.

### Error: "FormData is not defined"
**Solución:** Las Server Actions reciben FormData automáticamente. No uses `new FormData()` en el cliente.

### Error: "Cannot redirect in Server Action"
**Solución:** La redirección debe estar **fuera** del try-catch. Next.js usa excepciones para redirect.

```typescript
// ❌ INCORRECTO
try {
  // ... lógica
  redirect('/dashboard'); // Lanza excepción que se catchea
} catch (error) {
  // ...
}

// ✅ CORRECTO
try {
  // ... lógica
} catch (error) {
  // ...
}

redirect('/dashboard'); // Fuera del try-catch
```

### Error: "useFormState not updating"
**Solución:** El estado solo se actualiza cuando la Server Action retorna un nuevo objeto. Asegúrate de siempre retornar algo.

---

## 📚 Referencias

### Documentación
- [GUIDE_ARCHITECTURE.md](./GUIDE_ARCHITECTURE.md) - Sección 4.5: Server Actions vs API Routes
- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [useFormState Hook](https://react.dev/reference/react-dom/hooks/useFormState)
- [useFormStatus Hook](https://react.dev/reference/react-dom/hooks/useFormStatus)

### Código de Ejemplo
- `src/modules/phoneme-analysis/ui/actions/phoneme-analysis.actions.ts` - Implementación de Server Actions
- `src/app/auth/actions.ts` - Ejemplo de login con Server Actions
- `src/app/proxy-test-sa/page.tsx` - Ejemplo de uso básico
- `src/app/comparison-sa/page.tsx` - Ejemplo de comparación
- `src/app/debug-sa/page.tsx` - Ejemplo de debugging

---

## 🎯 Conclusión

La migración a Server Actions representa una mejora significativa en:

- ✅ **Arquitectura:** Mejor alineación con Next.js 16
- ✅ **DX:** Menos código, más declarativo
- ✅ **Performance:** Menos overhead de red
- ✅ **Type Safety:** Tipado automático end-to-end
- ✅ **Mantenibilidad:** Código más limpio y testeable

**Próximos pasos:**
1. Revisar y probar las nuevas páginas de Server Actions
2. Migrar componentes existentes gradualmente
3. Documentar cualquier caso edge encontrado
4. Planificar eliminación de API Routes deprecated

---

**Autor:** Equipo de Arquitectura  
**Última actualización:** Diciembre 2024  
**Estado:** ✅ Completado
