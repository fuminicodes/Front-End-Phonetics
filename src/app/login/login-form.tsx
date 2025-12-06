'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSearchParams } from 'next/navigation';
import { loginAction, type LoginActionState } from '@/app/auth/actions';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { Typography } from '@/shared/ui/typography';
import Link from 'next/link';

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="submit" 
      className="w-full" 
      disabled={pending}
      variant="solid"
      size="lg"
    >
      {pending ? 'Iniciando sesión...' : 'Iniciar sesión'}
    </Button>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';
  const error = searchParams.get('error');
  
  const initialState: LoginActionState = { errors: {}, success: false };
  const [state, formAction] = useActionState(loginAction, initialState);
  
  return (
    <form action={formAction} className="space-y-6">
      {/* Session expired error from middleware */}
      {error === 'session_expired' && (
        <Alert variant="destructive">
          <AlertDescription>
            Tu sesión ha expirado. Por favor, inicia sesión de nuevo.
          </AlertDescription>
        </Alert>
      )}
      
      {/* General form errors */}
      {state.errors?._form && (
        <Alert variant="destructive">
          <AlertDescription>
            {state.errors._form.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Hidden field for return URL */}
      <input type="hidden" name="returnUrl" value={returnUrl} />
      
      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="tu@ejemplo.com"
          className={state.errors?.email ? 'border-red-500' : ''}
        />
        {state.errors?.email && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.email.join(', ')}
          </p>
        )}
      </div>
      
      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
          className={state.errors?.password ? 'border-red-500' : ''}
        />
        {state.errors?.password && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.password.join(', ')}
          </p>
        )}
      </div>
      
      {/* Demo credentials hint */}
      <Alert>
        <AlertDescription>
          <Typography variant="small" className="font-semibold mb-1">
            Demo Credentials:
          </Typography>
          <Typography variant="small">
            Email: <code className="bg-muted px-1 rounded">demo@ejemplo.com</code><br />
            Password: <code className="bg-muted px-1 rounded">password</code>
          </Typography>
        </AlertDescription>
      </Alert>
      
      {/* Submit button */}
      <SubmitButton />
      
      {/* Register link */}
      <div className="text-center">
        <Typography variant="small" className="text-muted-foreground">
          ¿No tienes una cuenta?{' '}
          <Link 
            href="/register" 
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Regístrate aquí
          </Link>
        </Typography>
      </div>
    </form>
  );
}
