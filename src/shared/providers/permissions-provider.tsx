'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface PermissionsContextType {
  permissions: string[];
  userId?: string;
  email?: string;
}

const PermissionsContext = createContext<PermissionsContextType | null>(null);

interface PermissionsProviderProps {
  children: ReactNode;
  permissions: string[];
  userId?: string;
  email?: string;
}

/**
 * Provider to pass permissions from server to client components
 * 
 * @example
 * ```tsx
 * // In a Server Component or layout
 * import { SessionManager } from '@/shared/utils/session';
 * 
 * export default async function Layout({ children }) {
 *   const session = await SessionManager.getSession();
 *   
 *   return (
 *     <PermissionsProvider 
 *       permissions={session?.permissions || []}
 *       userId={session?.userId}
 *       email={session?.email}
 *     >
 *       {children}
 *     </PermissionsProvider>
 *   );
 * }
 * ```
 */
export function PermissionsProvider({ 
  children, 
  permissions,
  userId,
  email,
}: PermissionsProviderProps) {
  return (
    <PermissionsContext.Provider value={{ permissions, userId, email }}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * Hook to access permissions context
 * Must be used within PermissionsProvider
 */
export function usePermissionsContext(): PermissionsContextType {
  const context = useContext(PermissionsContext);
  
  if (!context) {
    // Return empty permissions if not in context
    // This allows components to work without throwing errors
    return { permissions: [] };
  }
  
  return context;
}
