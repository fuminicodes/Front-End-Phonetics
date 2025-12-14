'use client';

import { useState, useRef, useEffect } from 'react';
import { logoutAction } from '@/app/auth/actions';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/typography';
import { Can } from '@/shared/ui/can';
import { User, LogOut, ChevronDown, Settings, Shield, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';

interface UserMenuProps {
  userEmail?: string;
  userName?: string;
}

function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-red-500/10 transition-colors text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      <Typography variant="small" className="font-medium">
        {pending ? 'Cerrando sesión...' : 'Cerrar Sesión'}
      </Typography>
    </button>
  );
}

export function UserMenu({ userEmail, userName }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const initials = getInitials(userName, userEmail);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-glass-light hover:bg-glass-medium border border-glass-border transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Menú de usuario"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
          <Typography variant="small" className="font-semibold text-white">
            {initials}
          </Typography>
        </div>
        
        {/* User Name (desktop only) */}
        {userName && (
          <Typography variant="small" className="font-medium text-text-primary hidden sm:block">
            {userName}
          </Typography>
        )}
        
        {/* Chevron Icon */}
        <ChevronDown 
          className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-glass-light border border-glass-border rounded-lg shadow-lg overflow-hidden z-50">
          {/* User Info Section */}
          <div className="p-4 border-b border-glass-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <Typography variant="small" className="font-semibold text-white">
                  {initials}
                </Typography>
              </div>
              <div className="flex-1 min-w-0">
                {userName && (
                  <Typography variant="small" className="font-semibold text-text-primary truncate">
                    {userName}
                  </Typography>
                )}
                {userEmail && (
                  <Typography variant="small" className="text-text-secondary truncate">
                    {userEmail}
                  </Typography>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile Option (placeholder) */}
            <button
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-glass-medium transition-colors text-text-primary"
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to profile page
              }}
            >
              <User className="w-4 h-4 text-text-secondary" />
              <Typography variant="small">Mi Perfil</Typography>
            </button>

            {/* Settings Option (placeholder) */}
            <button
              className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-glass-medium transition-colors text-text-primary"
              onClick={() => {
                setIsOpen(false);
                // TODO: Navigate to settings page
              }}
            >
              <Settings className="w-4 h-4 text-text-secondary" />
              <Typography variant="small">Configuración</Typography>
            </button>

            {/* Admin Option (conditional) */}
            <Can permission="admin:access">
              <button
                className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-glass-medium transition-colors text-text-primary"
                onClick={() => {
                  setIsOpen(false);
                  // TODO: Navigate to admin page
                }}
              >
                <Shield className="w-4 h-4 text-text-secondary" />
                <Typography variant="small">Admin</Typography>
              </button>
            </Can>
          </div>

          {/* Logout Section */}
          <div className="border-t border-glass-border">
            <form action={logoutAction}>
              <LogoutButton />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
