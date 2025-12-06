import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/core/providers/app-providers";
import { ErrorBoundary } from "@/shared/ui/error-boundary";
import { BackgroundWrapper } from "@/shared/ui/background-wrapper";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Phonetics Analyzer | Nebula Glass",
  description: "Audio recording and phoneme analysis tool for speech processing - Next.js BFF Architecture with Nebula Glass Design System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary level="page">
          <AppProviders>
            <BackgroundWrapper variant="default">
              {children}
            </BackgroundWrapper>
          </AppProviders>
        </ErrorBoundary>
      </body>
    </html>
  );
}
