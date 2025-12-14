import { SessionManager } from '@/shared/utils/session';
import { UserMenu } from '@/shared/ui/user-menu';
import { Typography } from '@/shared/ui/typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';

export default async function UserMenuTestPage() {
  const session = await SessionManager.getSession();

  return (
    <div className="container mx-auto p-8 space-y-8">
      <Typography variant="h1">User Menu Test Page</Typography>
      
      <Card>
        <CardHeader>
          <CardTitle>User Menu Component</CardTitle>
          <CardDescription>
            Prueba del componente de perfil con dropdown
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-end p-4 bg-glass-light rounded-lg">
            {session ? (
              <UserMenu 
                userName={session.firstName && session.lastName ? `${session.firstName} ${session.lastName}` : undefined}
                userEmail={session.email}
              />
            ) : (
              <Typography variant="small" className="text-text-secondary">
                No hay sesión activa. Por favor, inicia sesión.
              </Typography>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Data</CardTitle>
          <CardDescription>
            Información de la sesión actual
          </CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <pre className="bg-glass-light p-4 rounded-lg overflow-auto">
              {JSON.stringify({
                userId: session.userId,
                email: session.email,
                firstName: session.firstName,
                lastName: session.lastName,
                permissions: session.permissions,
              }, null, 2)}
            </pre>
          ) : (
            <Typography variant="small" className="text-text-secondary">
              No hay sesión activa
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
