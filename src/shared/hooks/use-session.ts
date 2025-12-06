'use client';

import { useEffect, useState } from 'react';
import { SessionData } from '@/shared/utils/session';

/**
 * Client-side hook to access session data
 * Note: This should only be used for display purposes.
 * All authentication logic should be server-side.
 */
export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, you might fetch this from a dedicated API endpoint
    // For now, we'll just mark as loading complete since session validation
    // happens server-side in middleware
    setIsLoading(false);
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: session !== null,
  };
}
