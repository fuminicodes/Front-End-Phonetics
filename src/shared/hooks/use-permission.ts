'use client';

import { SessionManager } from '@/shared/utils/session';
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

/**
 * Server-side permission check
 * Use this in Server Components and Server Actions
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session || !session.permissions) return false;
    return session.permissions.includes(permission);
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Server-side resource access check
 */
export async function checkResourceAccess(resource: Resource, action: Action): Promise<boolean> {
  const permission = `${resource}:${action}`;
  return checkPermission(permission);
}

/**
 * Server-side check for any permission
 */
export async function checkAnyPermission(permissions: Permission[]): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session || !session.permissions) return false;
    return permissions.some(permission => session.permissions!.includes(permission));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Server-side check for all permissions
 */
export async function checkAllPermissions(permissions: Permission[]): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session || !session.permissions) return false;
    return permissions.every(permission => session.permissions!.includes(permission));
  } catch (error) {
    console.error('Error checking permissions:', error);
    return false;
  }
}

/**
 * Get current user permissions (server-side)
 */
export async function getUserPermissions(): Promise<Permission[]> {
  try {
    const session = await SessionManager.getSession();
    return session?.permissions || [];
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return [];
  }
}
