'use client';

import React from 'react';
import { usePermission } from '../hooks/use-permission';

interface CanProps {
  /** Single permission to check */
  permission?: string;
  /** Resource name for resource-action check */
  resource?: string;
  /** Action name for resource-action check */
  action?: string;
  /** Array of permissions (used with requireAll) */
  permissions?: string[];
  /** If true, requires all permissions. If false, requires any permission */
  requireAll?: boolean;
  /** Content to render if user has permission */
  children: React.ReactNode;
  /** Content to render if user doesn't have permission */
  fallback?: React.ReactNode;
  /** Show loading state while checking permissions */
  showLoadingFallback?: boolean;
}

/**
 * Conditional rendering component based on user permissions (RBAC)
 * 
 * @example
 * ```tsx
 * // Check single permission
 * <Can permission="users:delete">
 *   <DeleteButton />
 * </Can>
 * 
 * // Check resource and action
 * <Can resource="phoneme" action="analyze">
 *   <AnalyzeButton />
 * </Can>
 * 
 * // Check multiple permissions (any)
 * <Can permissions={['users:read', 'users:update']}>
 *   <UsersList />
 * </Can>
 * 
 * // Check multiple permissions (all required)
 * <Can permissions={['users:read', 'users:update']} requireAll>
 *   <UsersList />
 * </Can>
 * 
 * // With fallback
 * <Can 
 *   permission="admin:access" 
 *   fallback={<div>Access denied</div>}
 * >
 *   <AdminPanel />
 * </Can>
 * ```
 */
export function Can({ 
  permission, 
  resource, 
  action, 
  permissions, 
  requireAll = false,
  children, 
  fallback = null,
  showLoadingFallback = false,
}: CanProps) {
  const { 
    hasPermission, 
    hasResourceAccess, 
    hasAllPermissions, 
    hasAnyPermission,
    isLoading 
  } = usePermission();
  
  if (isLoading && showLoadingFallback) {
    return <>{fallback}</>;
  }
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (resource && action) {
    hasAccess = hasResourceAccess(resource, action);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

/**
 * Higher-order component to protect components with permissions
 * 
 * @example
 * ```tsx
 * const ProtectedComponent = withPermission(MyComponent, 'users:read');
 * 
 * // Or with options
 * const ProtectedComponent = withPermission(MyComponent, {
 *   permission: 'users:read',
 *   fallback: <AccessDenied />
 * });
 * ```
 */
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  permissionOrOptions: string | {
    permission?: string;
    resource?: string;
    action?: string;
    permissions?: string[];
    requireAll?: boolean;
    fallback?: React.ReactNode;
  }
): React.ComponentType<P> {
  return function PermissionWrappedComponent(props: P) {
    const options = typeof permissionOrOptions === 'string'
      ? { permission: permissionOrOptions }
      : permissionOrOptions;
    
    return (
      <Can {...options}>
        <Component {...props} />
      </Can>
    );
  };
}

/**
 * Component to hide content from users without permission
 * Opposite of Can - renders children only if user DOESN'T have permission
 * 
 * @example
 * ```tsx
 * <Cannot permission="users:delete">
 *   <p>You don't have delete permissions</p>
 * </Cannot>
 * ```
 */
export function Cannot({
  permission,
  resource,
  action,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}: Omit<CanProps, 'showLoadingFallback'>) {
  const { 
    hasPermission, 
    hasResourceAccess, 
    hasAllPermissions, 
    hasAnyPermission 
  } = usePermission();
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(permission);
  } else if (resource && action) {
    hasAccess = hasResourceAccess(resource, action);
  } else if (permissions) {
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }
  
  // Render children only if user DOESN'T have access
  return !hasAccess ? <>{children}</> : <>{fallback}</>;
}
