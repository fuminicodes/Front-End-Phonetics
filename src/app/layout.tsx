import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/core/providers/app-providers";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { BackgroundWrapper } from "@/shared/ui/background-wrapper";
import { PermissionsProvider } from "@/shared/providers/permissions-provider";
import { SessionManager } from "@/shared/utils/session";
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Phonetics Analyzer | Nebula Glass",
  description: "Audio recording and phoneme analysis tool for speech processing - Next.js BFF Architecture with Nebula Glass Design System",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session server-side to pass permissions to client
  const session = await SessionManager.getSession();
  
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary level="page">
          <AppProviders>
            <NuqsAdapter>
              <PermissionsProvider 
                permissions={session?.permissions || []}
                userId={session?.userId}
                email={session?.email}
              >
                <BackgroundWrapper variant="default">
                  {children}
                </BackgroundWrapper>
              </PermissionsProvider>
            </NuqsAdapter>
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
