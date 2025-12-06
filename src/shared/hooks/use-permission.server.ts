/**
 * Server-side permission checking functions
 * 
 * These functions run on the server and check permissions from the session.
 * Use these in Server Actions, API Routes, and Server Components.
 */

import { SessionManager } from '@/shared/utils/session';

type Permission = string;
type Resource = string;
type Action = string;

/**
 * Check if user has a specific permission (Server-side)
 * 
 * @example
 * ```ts
 * const canDelete = await checkPermission('users:delete');
 * if (!canDelete) {
 *   return { error: 'No permission' };
 * }
 * ```
 */
export async function checkPermission(permission: Permission): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session?.permissions) return false;
    return session.permissions.includes(permission);
  } catch {
    return false;
  }
}

/**
 * Check if user has access to a resource with specific action (Server-side)
 * 
 * @example
 * ```ts
 * const canAnalyze = await checkResourceAccess('phoneme', 'analyze');
 * ```
 */
export async function checkResourceAccess(
  resource: Resource,
  action: Action
): Promise<boolean> {
  const permission = `${resource}:${action}`;
  return checkPermission(permission);
}

/**
 * Check if user has ANY of the specified permissions (Server-side)
 */
export async function checkAnyPermission(permissions: Permission[]): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session?.permissions || session.permissions.length === 0) return false;
    return permissions.some(permission => session.permissions!.includes(permission));
  } catch {
    return false;
  }
}

/**
 * Check if user has ALL of the specified permissions (Server-side)
 */
export async function checkAllPermissions(permissions: Permission[]): Promise<boolean> {
  try {
    const session = await SessionManager.getSession();
    if (!session?.permissions || session.permissions.length === 0) return false;
    return permissions.every(permission => session.permissions!.includes(permission));
  } catch {
    return false;
  }
}

/**
 * Get all permissions for the current user (Server-side)
 */
export async function getUserPermissions(): Promise<Permission[]> {
  try {
    const session = await SessionManager.getSession();
    return session?.permissions || [];
  } catch {
    return [];
  }
}
