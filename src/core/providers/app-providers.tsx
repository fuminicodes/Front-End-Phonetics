'use client';

import { QueryProvider } from './query-provider';
import { ThemeProvider } from '@/shared/providers/theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryProvider>
        {children}
      </QueryProvider>
    </ThemeProvider>
  );
}