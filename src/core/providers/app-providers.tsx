'use client';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';
import { MSWProvider } from '@/shared/providers/msw-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MSWProvider>
      <ThemeProvider defaultTheme="system">
        <QueryProvider>
          {children}
        </QueryProvider>
      </ThemeProvider>
    </MSWProvider>
  );
}