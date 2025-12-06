# URL as State with nuqs

## Descripción General

Este documento describe el sistema de gestión de estado en URL implementado con **nuqs**, que permite sincronizar el estado de la aplicación con los parámetros de búsqueda de la URL de forma declarativa y type-safe.

## ¿Por qué URL as State?

### Ventajas

1. **Shareability**: Los usuarios pueden compartir URLs con filtros y configuraciones específicas
2. **Bookmarking**: Permite guardar vistas específicas como marcadores
3. **Browser Navigation**: Los botones atrás/adelante funcionan correctamente
4. **Deep Linking**: Acceso directo a vistas específicas de la aplicación
5. **Persistence**: El estado se mantiene al recargar la página
6. **SEO**: Mejora indexación (para rutas públicas)
7. **Analytics**: Facilita tracking de comportamiento de usuarios

### Cuándo usar URL State

✅ **SÍ usar para:**
- Filtros de búsqueda
- Paginación
- Ordenamiento de tablas
- Tabs activos
- Modales/Dialogs que deben ser compartibles
- Configuraciones de vistas (grid/list/table)
- Rangos de fechas
- Categorías seleccionadas

❌ **NO usar para:**
- Datos sensibles (contraseñas, tokens)
- Estado temporal de UI (hover, focus)
- Estado de formularios no enviados
- Datos grandes o complejos
- Estado que cambia muy rápidamente

## Instalación

nuqs ya está instalado en el proyecto:

```json
{
  "dependencies": {
    "nuqs": "^2.8.2"
  }
}
```

## Uso Básico

### 1. Hook Simple: `useQueryState`

```typescript
import { useQueryState, parseAsString } from 'nuqs';

export function SearchComponent() {
  const [search, setSearch] = useQueryState('search', parseAsString.withDefault(''));
  
  // URL: ?search=hello
  // search = "hello"
  
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 2. Múltiples Parámetros: `useQueryStates`

```typescript
import { useQueryStates, parseAsString, parseAsInteger } from 'nuqs';

export function FilterComponent() {
  const [params, setParams] = useQueryStates({
    search: parseAsString.withDefault(''),
    page: parseAsInteger.withDefault(1),
    role: parseAsString.withDefault(''),
  });
  
  // URL: ?search=john&page=2&role=admin
  // params = { search: 'john', page: 2, role: 'admin' }
  
  // Update multiple params at once
  setParams({ search: 'jane', page: 1 });
}
```

## Hooks Compartidos (Reusables)

El proyecto incluye hooks pre-configurados en `src/shared/hooks/use-query-params.ts`:

### Search Hook

```typescript
import { useSearchParam } from '@/shared/hooks/use-query-params';

export function SearchBar() {
  const [search, setSearch] = useSearchParam();
  
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Pagination Hook

```typescript
import { usePaginationParams } from '@/shared/hooks/use-query-params';

export function Pagination() {
  const { page, pageSize, setPage, setPageSize } = usePaginationParams();
  
  return (
    <div>
      <button onClick={() => setPage(page - 1)}>Previous</button>
      <span>Page {page}</span>
      <button onClick={() => setPage(page + 1)}>Next</button>
      
      <select 
        value={pageSize} 
        onChange={(e) => setPageSize(Number(e.target.value))}
      >
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  );
}
```

### Sorting Hook

```typescript
import { useSortParams } from '@/shared/hooks/use-query-params';

export function TableHeader() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useSortParams();
  
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };
  
  return (
    <th onClick={() => handleSort('name')}>
      Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
    </th>
  );
}
```

### Filter Hook

```typescript
import { useFilterParams } from '@/shared/hooks/use-query-params';

export function FilterPanel() {
  const { role, status, category, setRole, setStatus } = useFilterParams();
  
  return (
    <div>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="">All Roles</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </select>
      
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>
  );
}
```

### Tab Hook

```typescript
import { useTabParam } from '@/shared/hooks/use-query-params';

export function Tabs() {
  const [activeTab, setActiveTab] = useTabParam('overview');
  
  return (
    <div>
      <button 
        onClick={() => setActiveTab('overview')}
        className={activeTab === 'overview' ? 'active' : ''}
      >
        Overview
      </button>
      <button 
        onClick={() => setActiveTab('settings')}
        className={activeTab === 'settings' ? 'active' : ''}
      >
        Settings
      </button>
      
      {activeTab === 'overview' && <OverviewContent />}
      {activeTab === 'settings' && <SettingsContent />}
    </div>
  );
}
```

### Modal Hook

```typescript
import { useModalParam } from '@/shared/hooks/use-query-params';

export function UserList() {
  const [isCreateModalOpen, { open, close }] = useModalParam('create-user');
  
  return (
    <div>
      <button onClick={open}>Create User</button>
      
      {isCreateModalOpen && (
        <Modal onClose={close}>
          <CreateUserForm />
        </Modal>
      )}
    </div>
  );
}
```

### View Mode Hook

```typescript
import { useViewModeParam } from '@/shared/hooks/use-query-params';

export function DataView() {
  const [viewMode, setViewMode] = useViewModeParam();
  
  return (
    <div>
      <button onClick={() => setViewMode('grid')}>Grid</button>
      <button onClick={() => setViewMode('list')}>List</button>
      <button onClick={() => setViewMode('table')}>Table</button>
      
      {viewMode === 'grid' && <GridView />}
      {viewMode === 'list' && <ListView />}
      {viewMode === 'table' && <TableView />}
    </div>
  );
}
```

### Boolean Flag Hook

```typescript
import { useBooleanParam } from '@/shared/hooks/use-query-params';

export function ArchiveToggle() {
  const [showArchived, setShowArchived] = useBooleanParam('archived');
  
  return (
    <label>
      <input
        type="checkbox"
        checked={showArchived}
        onChange={(e) => setShowArchived(e.target.checked)}
      />
      Show Archived
    </label>
  );
}
```

### Array Filter Hook

```typescript
import { useArrayFilterParam } from '@/shared/hooks/use-query-params';

export function TagFilter() {
  const [tags, setTags] = useArrayFilterParam('tags');
  
  // URL: ?tags=react&tags=typescript
  // tags = ['react', 'typescript']
  
  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };
  
  return (
    <div>
      {['react', 'typescript', 'nextjs'].map(tag => (
        <button 
          key={tag}
          onClick={() => toggleTag(tag)}
          className={tags.includes(tag) ? 'active' : ''}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}
```

### Complete Table Hook

```typescript
import { useTableParams } from '@/shared/hooks/use-query-params';

export function DataTable() {
  const {
    search,
    setSearch,
    page,
    pageSize,
    setPage,
    setPageSize,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } = useTableParams();
  
  // All table state in one hook!
  // URL: ?search=hello&page=2&pageSize=20&sortBy=name&sortOrder=asc
  
  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <Table 
        sortBy={sortBy} 
        sortOrder={sortOrder}
        onSort={(field) => setSortBy(field)}
      />
      <Pagination 
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
```

## Parsers Disponibles

nuqs proporciona parsers type-safe para diferentes tipos de datos:

```typescript
import {
  parseAsString,
  parseAsInteger,
  parseAsFloat,
  parseAsBoolean,
  parseAsStringEnum,
  parseAsArrayOf,
  parseAsJson,
  parseAsIsoDateTime,
} from 'nuqs';

// String
const [search] = useQueryState('search', parseAsString.withDefault(''));

// Integer
const [page] = useQueryState('page', parseAsInteger.withDefault(1));

// Float
const [price] = useQueryState('price', parseAsFloat.withDefault(0.0));

// Boolean
const [enabled] = useQueryState('enabled', parseAsBoolean.withDefault(false));

// Enum
type Role = 'admin' | 'user' | 'guest';
const [role] = useQueryState(
  'role',
  parseAsStringEnum<Role>(['admin', 'user', 'guest']).withDefault('guest')
);

// Array
const [tags] = useQueryState(
  'tags',
  parseAsArrayOf(parseAsString).withDefault([])
);

// JSON Object
const [config] = useQueryState(
  'config',
  parseAsJson<{ theme: string; layout: string }>().withDefault({ theme: 'light', layout: 'grid' })
);

// ISO DateTime
const [date] = useQueryState(
  'date',
  parseAsIsoDateTime.withDefault(new Date())
);
```

## Ejemplos de Uso Real

### 1. Phoneme Analysis Parameters

```typescript
// src/modules/phoneme-analysis/ui/hooks/use-phoneme-analysis-params.ts
import { useQueryStates, parseAsStringEnum } from 'nuqs';

export function usePhonemeAnalysisParams() {
  const [params, setParams] = useQueryStates({
    targetLanguage: parseAsStringEnum(['en', 'es', 'fr']).withDefault('en'),
    analysisType: parseAsStringEnum(['pronunciation', 'vowel', 'consonant']).withDefault('pronunciation'),
    expectedText: parseAsString.withDefault(''),
  });

  return {
    ...params,
    setParams,
  };
}
```

### 2. User Management Table

```typescript
export function UsersTable() {
  const [search, setSearch] = useSearchParam();
  const { role, status, setRole, setStatus } = useFilterParams();
  const { page, pageSize, setPage, setPageSize } = usePaginationParams();
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useSortParams();

  // Fetch data based on URL params
  const { data, isLoading } = useQuery({
    queryKey: ['users', search, role, status, page, pageSize, sortBy, sortOrder],
    queryFn: () => fetchUsers({ search, role, status, page, pageSize, sortBy, sortOrder }),
  });

  return (
    <div>
      <SearchBar value={search} onChange={setSearch} />
      <FilterPanel role={role} status={status} onRoleChange={setRole} onStatusChange={setStatus} />
      <Table data={data} sortBy={sortBy} sortOrder={sortOrder} onSort={setSortBy} />
      <Pagination page={page} pageSize={pageSize} onPageChange={setPage} />
    </div>
  );
}
```

### 3. E-commerce Product Filters

```typescript
export function ProductFilters() {
  const [search, setSearch] = useSearchParam();
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  const [minPrice, setMinPrice] = useQueryState('minPrice', parseAsInteger.withDefault(0));
  const [maxPrice, setMaxPrice] = useQueryState('maxPrice', parseAsInteger.withDefault(1000));
  const [inStock, setInStock] = useBooleanParam('inStock', true);
  const [brands, setBrands] = useArrayFilterParam('brands');

  // URL: ?search=laptop&category=electronics&minPrice=500&maxPrice=1500&inStock=true&brands=apple&brands=dell

  return (
    <div>
      <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." />
      
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <div>
        <input type="number" value={minPrice} onChange={(e) => setMinPrice(Number(e.target.value))} />
        <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
      </div>

      <label>
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
        In Stock Only
      </label>
    </div>
  );
}
```

### 4. Dashboard with Tabs and Date Range

```typescript
export function Dashboard() {
  const [activeTab, setActiveTab] = useTabParam('overview');
  const { startDate, endDate, setStartDate, setEndDate } = useDateRangeParams();
  
  // URL: ?tab=analytics&startDate=2024-01-01&endDate=2024-12-31

  return (
    <div>
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />
      <DateRangePicker 
        startDate={startDate} 
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
      />
      
      {activeTab === 'overview' && <OverviewTab startDate={startDate} endDate={endDate} />}
      {activeTab === 'analytics' && <AnalyticsTab startDate={startDate} endDate={endDate} />}
    </div>
  );
}
```

## Patrones Avanzados

### 1. Reset All Filters

```typescript
export function FilterPanel() {
  const [search, setSearch] = useSearchParam();
  const { role, setRole, status, setStatus } = useFilterParams();
  const { setPage } = usePaginationParams();
  
  const resetFilters = () => {
    setSearch('');
    setRole('');
    setStatus('');
    setPage(1);
  };
  
  return (
    <div>
      {/* Filters */}
      <button onClick={resetFilters}>Clear All Filters</button>
    </div>
  );
}
```

### 2. Sync with React Query

```typescript
export function UsersList() {
  const [search] = useSearchParam();
  const { page, pageSize } = usePaginationParams();
  
  const { data } = useQuery({
    queryKey: ['users', search, page, pageSize],
    queryFn: () => fetchUsers({ search, page, pageSize }),
  });
  
  // React Query automatically refetches when URL params change!
  
  return <div>{/* Render users */}</div>;
}
```

### 3. Debounced Search

```typescript
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value';

export function SearchWithDebounce() {
  const [search, setSearch] = useSearchParam();
  const debouncedSearch = useDebouncedValue(search, 500);
  
  // Use debouncedSearch for API calls
  const { data } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: () => searchAPI(debouncedSearch),
  });
  
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

### 4. Shallow Routing (No Page Reload)

Por defecto, nuqs usa shallow routing, pero puedes configurarlo:

```typescript
const [search, setSearch] = useQueryState('search', {
  shallow: true, // Default: no page reload
  scroll: false, // Don't scroll to top on change
  history: 'push', // 'push' | 'replace'
});
```

## Demo Page

El proyecto incluye una página de demostración completa en:

```
/examples/url-state
```

Esta página muestra:
- ✅ Búsqueda en tiempo real
- ✅ Filtros múltiples (role, status)
- ✅ Paginación (page, pageSize)
- ✅ Ordenamiento (sortBy, sortOrder)
- ✅ Modos de vista (grid, list, table)
- ✅ Flags booleanos (showArchived)
- ✅ Integración con RBAC (Can component)

## Mejores Prácticas

### 1. Nombrar Parámetros de Forma Consistente

```typescript
// ✅ BIEN: nombres claros y consistentes
?search=hello&page=2&sortBy=name&sortOrder=asc

// ❌ MAL: nombres inconsistentes o confusos
?q=hello&p=2&sort=name&dir=asc
```

### 2. Valores por Defecto

Siempre proporciona valores por defecto sensatos:

```typescript
// ✅ BIEN
const [page] = useQueryState('page', parseAsInteger.withDefault(1));

// ❌ MAL (puede ser undefined)
const [page] = useQueryState('page', parseAsInteger);
```

### 3. Reset Page on Filter Change

```typescript
const [search, setSearch] = useSearchParam();
const { setPage } = usePaginationParams();

const handleSearchChange = (value: string) => {
  setSearch(value);
  setPage(1); // Reset to first page when searching
};
```

### 4. Type Safety con Enums

```typescript
// ✅ BIEN: Type-safe
const [role, setRole] = useQueryState(
  'role',
  parseAsStringEnum<Role>(['admin', 'user']).withDefault('user')
);

// ❌ MAL: No type-safe
const [role, setRole] = useQueryState('role', parseAsString);
```

### 5. Combinar con useEffect Solo Si Es Necesario

```typescript
// ✅ BIEN: Directo con React Query
const [search] = useSearchParam();
const { data } = useQuery({
  queryKey: ['users', search],
  queryFn: () => fetchUsers(search),
});

// ❌ Innecesario: useEffect redundante
const [search] = useSearchParam();
useEffect(() => {
  fetchUsers(search).then(setData);
}, [search]);
```

## Testing

```typescript
import { render } from '@testing-library/react';
import { NuqsTestingAdapter } from 'nuqs/adapters/testing';

test('filters users by role', () => {
  render(
    <NuqsTestingAdapter searchParams="?role=admin">
      <UserList />
    </NuqsTestingAdapter>
  );
  
  // Assert filtered results
});
```

## Troubleshooting

### Error: "useQueryState must be used within NuqsAdapter"

**Solución**: Asegúrate de que tu componente está dentro de un layout que usa Next.js App Router (que nuqs detecta automáticamente).

### Los parámetros no se actualizan

**Solución**: Verifica que estás usando `'use client'` en el componente.

### Valores por defecto no funcionan

**Solución**: Usa `.withDefault()` en el parser:

```typescript
parseAsString.withDefault('') // ✅
parseAsString // ❌
```

## Referencias

- **Documentación oficial**: https://nuqs.47ng.com/
- **GitHub**: https://github.com/47ng/nuqs
- **Hooks compartidos**: `src/shared/hooks/use-query-params.ts`
- **Ejemplo en phoneme-analysis**: `src/modules/phoneme-analysis/ui/hooks/use-phoneme-analysis-params.ts`
- **Demo completa**: `/examples/url-state`
