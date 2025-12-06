/**
 * Shared query params hooks using nuqs
 * 
 * Provides reusable hooks for common URL state patterns like
 * search, filters, pagination, and sorting.
 * 
 * @see https://nuqs.47ng.com/
 */

import { 
  useQueryState, 
  useQueryStates,
  parseAsString, 
  parseAsInteger, 
  parseAsBoolean,
  parseAsArrayOf,
  parseAsStringEnum
} from 'nuqs';

// ===== SEARCH =====

/**
 * Hook for managing a search query in the URL
 * 
 * @example
 * const [search, setSearch] = useSearchParam();
 * // URL: ?search=hello
 * // search = "hello"
 */
export function useSearchParam() {
  return useQueryState('search', parseAsString.withDefault(''));
}

// ===== FILTERS =====

/**
 * Hook for managing filter state in the URL
 * 
 * @example
 * const { role, status, setRole, setStatus } = useFilterParams();
 * // URL: ?role=admin&status=active
 */
export function useFilterParams() {
  const [role, setRole] = useQueryState('role', parseAsString.withDefault(''));
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''));
  const [category, setCategory] = useQueryState('category', parseAsString.withDefault(''));
  
  return {
    role,
    status,
    category,
    setRole,
    setStatus,
    setCategory,
  };
}

/**
 * Hook for managing multiple filter values as arrays
 * 
 * @example
 * const [tags, setTags] = useArrayFilterParam('tags');
 * // URL: ?tags=react&tags=typescript
 * // tags = ['react', 'typescript']
 */
export function useArrayFilterParam(key: string) {
  return useQueryState(
    key,
    parseAsArrayOf(parseAsString).withDefault([])
  );
}

// ===== PAGINATION =====

/**
 * Hook for managing pagination state in the URL
 * 
 * @example
 * const { page, pageSize, setPage, setPageSize } = usePaginationParams();
 * // URL: ?page=2&pageSize=20
 */
export function usePaginationParams() {
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState('pageSize', parseAsInteger.withDefault(10));
  
  return {
    page,
    pageSize,
    setPage,
    setPageSize,
  };
}

// ===== SORTING =====

export type SortOrder = 'asc' | 'desc';

/**
 * Hook for managing sort state in the URL
 * 
 * @example
 * const { sortBy, sortOrder, setSortBy, setSortOrder } = useSortParams();
 * // URL: ?sortBy=name&sortOrder=asc
 */
export function useSortParams() {
  const [sortBy, setSortBy] = useQueryState('sortBy', parseAsString.withDefault(''));
  const [sortOrder, setSortOrder] = useQueryState(
    'sortOrder',
    parseAsStringEnum<SortOrder>(['asc', 'desc']).withDefault('asc')
  );
  
  return {
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  };
}

// ===== TABS =====

/**
 * Hook for managing active tab in the URL
 * 
 * @example
 * const [activeTab, setActiveTab] = useTabParam('overview');
 * // URL: ?tab=settings
 */
export function useTabParam(defaultTab: string = 'overview') {
  return useQueryState('tab', parseAsString.withDefault(defaultTab));
}

// ===== MODAL/DIALOG STATE =====

/**
 * Hook for managing modal/dialog open state in the URL
 * 
 * @example
 * const [isOpen, setIsOpen] = useModalParam('create-user');
 * // URL: ?modal=create-user
 * // isOpen = true
 */
export function useModalParam(modalName: string) {
  const [modal, setModal] = useQueryState('modal', parseAsString.withDefault(''));
  
  const isOpen = modal === modalName;
  const open = () => setModal(modalName);
  const close = () => setModal(null);
  
  return [isOpen, { open, close, setModal }] as const;
}

// ===== VIEW MODE =====

export type ViewMode = 'grid' | 'list' | 'table';

/**
 * Hook for managing view mode in the URL
 * 
 * @example
 * const [viewMode, setViewMode] = useViewModeParam();
 * // URL: ?view=grid
 */
export function useViewModeParam(defaultView: ViewMode = 'grid') {
  return useQueryState(
    'view',
    parseAsStringEnum<ViewMode>(['grid', 'list', 'table']).withDefault(defaultView)
  );
}

// ===== DATE RANGE =====

/**
 * Hook for managing date range in the URL
 * 
 * @example
 * const { startDate, endDate, setStartDate, setEndDate } = useDateRangeParams();
 * // URL: ?startDate=2024-01-01&endDate=2024-12-31
 */
export function useDateRangeParams() {
  const [startDate, setStartDate] = useQueryState('startDate', parseAsString.withDefault(''));
  const [endDate, setEndDate] = useQueryState('endDate', parseAsString.withDefault(''));
  
  return {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
  };
}

// ===== BOOLEAN FLAGS =====

/**
 * Hook for managing boolean flags in the URL
 * 
 * @example
 * const [showArchived, setShowArchived] = useBooleanParam('archived');
 * // URL: ?archived=true
 */
export function useBooleanParam(key: string, defaultValue: boolean = false) {
  return useQueryState(key, parseAsBoolean.withDefault(defaultValue));
}

// ===== COMBINED HOOKS =====

/**
 * Hook for managing complete table state (search, filters, pagination, sort)
 * 
 * @example
 * const tableState = useTableParams();
 * // URL: ?search=hello&page=2&sortBy=name&sortOrder=asc
 */
export function useTableParams() {
  const [search, setSearch] = useSearchParam();
  const pagination = usePaginationParams();
  const sort = useSortParams();
  
  return {
    search,
    setSearch,
    ...pagination,
    ...sort,
  };
}

/**
 * Hook for managing all query states at once
 * Use this when you need to update multiple params simultaneously
 * 
 * @example
 * const [params, setParams] = useAllQueryParams({
 *   search: parseAsString.withDefault(''),
 *   page: parseAsInteger.withDefault(1),
 * });
 * 
 * // Update multiple params at once
 * setParams({ search: 'new search', page: 1 });
 */
export function useAllQueryParams<T extends Record<string, any>>(
  schema: Record<keyof T, any>
) {
  return useQueryStates(schema);
}
