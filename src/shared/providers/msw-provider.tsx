/**
 * MSW (Mock Service Worker) Provider
 * 
 * Conditionally enables MSW mocking in development mode.
 * This provider should be rendered early in the app tree.
 */

'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    // Only initialize MSW in development and on the client side
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
      const initMSW = async () => {
        const { worker } = await import('../../../mocks/browser');
        
        await worker.start({
          onUnhandledRequest: 'bypass', // Don't warn about unhandled requests
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        });

        console.log('[MSW] Mocking enabled for development');
        setMswReady(true);
      };

      initMSW();
    } else {
      // In production or SSR, immediately set as ready
      setMswReady(true);
    }
  }, []);

  // In development, wait for MSW to be ready before rendering children
  // This prevents race conditions where API calls happen before mocks are set up
  if (process.env.NODE_ENV === 'development' && !mswReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-primary mx-auto"></div>
          <p className="text-muted-foreground">Initializing development environment...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
