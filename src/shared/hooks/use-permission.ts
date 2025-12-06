'use client';

import { usePermissionsContext } from '@/shared/providers/permissions-provider';

type Permission = string;
type Resource = string;
type Action = string;

interface UsePermissionReturn {
  hasPermission: (permission: Permission) => boolean;
  hasResourceAccess: (resource: Resource, action: Action) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  hasAllPermissions: (permissions: Permission[]) => boolean;
  permissions: Permission[];
  isLoading: boolean;
}

/**
 * Hook to check user permissions (RBAC)
 * 
 * @example
 * ```tsx
 * const { hasPermission, hasResourceAccess } = usePermission();
 * 
 * if (hasPermission('users:delete')) {
 *   // Show delete button
 * }
 * 
 * if (hasResourceAccess('phoneme', 'analyze')) {
 *   // Allow analysis
 * }
 * ```
 */
export function usePermission(): UsePermissionReturn {
  const { permissions } = usePermissionsContext();

  const hasPermission = (permission: Permission): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return permissions.includes(permission);
  };

  const hasResourceAccess = (resource: Resource, action: Action): boolean => {
    const permission = `${resource}:${action}`;
    return hasPermission(permission);
  };

  const hasAnyPermission = (perms: Permission[]): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return perms.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (perms: Permission[]): boolean => {
    if (!permissions || permissions.length === 0) return false;
    return perms.every(permission => hasPermission(permission));
  };

  return {
    hasPermission,
    hasResourceAccess,
    hasAnyPermission,
    hasAllPermissions,
    permissions,
    isLoading: false,
  };
}
