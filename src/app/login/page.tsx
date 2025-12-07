import { Suspense } from 'react';
import { LoginForm } from './login-form';
import { Card } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { BackgroundWrapper } from '@/shared/ui/background-wrapper';
import { Skeleton } from '@/shared/ui/skeleton';

function LoginFormFallback() {
  return (
    <div className="space-y-6">
      <Skeleton variant="glass" className="h-10 w-full" />
      <Skeleton variant="glass" className="h-10 w-full" />
      <Skeleton variant="glass" className="h-10 w-full" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 glass-panel">
          <div className="text-center mb-8">
            <Typography variant="h1" className="mb-2">
              🎵 Phonetics
            </Typography>
            <Typography variant="h3" className="mb-4">
              Iniciar Sesión
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              Accede a tu cuenta para analizar tu pronunciación
            </Typography>
          </div>
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
