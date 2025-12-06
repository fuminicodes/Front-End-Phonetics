'use client';

import { logoutAction } from '@/app/auth/actions';
import { Button } from '@/shared/ui/button';
import { Typography } from '@/shared/ui/typography';

interface UserMenuProps {
  userEmail?: string;
  userName?: string;
}

export function UserMenu({ userEmail, userName }: UserMenuProps) {
  return (
    <div className="flex items-center gap-4">
      {userName && (
        <Typography variant="small" className="text-muted-foreground">
          Hola, <span className="font-semibold">{userName}</span>
        </Typography>
      )}
      {userEmail && !userName && (
        <Typography variant="small" className="text-muted-foreground">
          {userEmail}
        </Typography>
      )}
      <form action={logoutAction}>
        <Button type="submit" variant="glass" size="sm">
          Cerrar Sesión
        </Button>
      </form>
    </div>
  );
}
