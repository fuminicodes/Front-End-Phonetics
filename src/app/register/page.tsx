import { RegisterForm } from './register-form';
import { Card } from '@/shared/ui/card';
import { Typography } from '@/shared/ui/typography';
import { BackgroundWrapper } from '@/shared/ui/background-wrapper';

export default function RegisterPage() {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 glass-panel">
          <div className="text-center mb-8">
            <Typography variant="h1" className="mb-2">
              🎵 Phonetics
            </Typography>
            <Typography variant="h3" className="mb-4">
              Crear Cuenta
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              Regístrate para comenzar a mejorar tu pronunciación
            </Typography>
          </div>
          <RegisterForm />
        </Card>
      </div>
    </BackgroundWrapper>
  );
}
