import { SessionManager } from '@/shared/utils/session';
import { UserMenu } from '@/shared/ui/user-menu';
import { Typography } from '@/shared/ui/typography';
import Link from 'next/link';

export async function Header() {
  const session = await SessionManager.getSession();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-glass-border bg-glass-light/95 backdrop-blur supports-[backdrop-filter]:bg-glass-light/60">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Typography variant="h3" className="font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
            Phonetics Analyzer
          </Typography>
        </Link>

        {/* Navigation - can be expanded later */}
        <nav className="hidden md:flex items-center gap-6">
          {/* Add navigation items here as needed */}
        </nav>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          {session ? (
            <UserMenu 
              userName={session.firstName && session.lastName ? `${session.firstName} ${session.lastName}` : undefined} 
              userEmail={session.email}
            />
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/login"
                className="px-4 py-2 text-sm font-medium text-text-primary hover:text-accent-primary transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link 
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-accent-primary to-accent-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
