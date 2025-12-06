'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerAction, type RegisterActionState } from '@/app/auth/actions';
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
      {pending ? 'Creando cuenta...' : 'Crear cuenta'}
    </Button>
  );
}

export function RegisterForm() {
  const initialState: RegisterActionState = { errors: {}, success: false };
  const [state, formAction] = useActionState(registerAction, initialState);
  
  return (
    <form action={formAction} className="space-y-4">
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
      
      {/* First Name */}
      <div className="space-y-2">
        <label htmlFor="firstName" className="block text-sm font-medium">
          Nombre
        </label>
        <Input
          id="firstName"
          name="firstName"
          type="text"
          autoComplete="given-name"
          required
          placeholder="Juan"
          className={state.errors?.firstName ? 'border-red-500' : ''}
        />
        {state.errors?.firstName && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.firstName.join(', ')}
          </p>
        )}
      </div>
      
      {/* Last Name */}
      <div className="space-y-2">
        <label htmlFor="lastName" className="block text-sm font-medium">
          Apellido
        </label>
        <Input
          id="lastName"
          name="lastName"
          type="text"
          autoComplete="family-name"
          required
          placeholder="Pérez"
          className={state.errors?.lastName ? 'border-red-500' : ''}
        />
        {state.errors?.lastName && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.lastName.join(', ')}
          </p>
        )}
      </div>
      
      {/* Email */}
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
      
      {/* Password */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Contraseña
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Mínimo 8 caracteres"
          className={state.errors?.password ? 'border-red-500' : ''}
        />
        {state.errors?.password && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.password.join(', ')}
          </p>
        )}
      </div>
      
      {/* Confirm Password */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium">
          Confirmar Contraseña
        </label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          placeholder="Repite tu contraseña"
          className={state.errors?.confirmPassword ? 'border-red-500' : ''}
        />
        {state.errors?.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">
            {state.errors.confirmPassword.join(', ')}
          </p>
        )}
      </div>
      
      {/* Submit button */}
      <SubmitButton />
      
      {/* Login link */}
      <div className="text-center">
        <Typography variant="small" className="text-muted-foreground">
          ¿Ya tienes una cuenta?{' '}
          <Link 
            href="/login" 
            className="text-primary-600 hover:text-primary-700 font-semibold"
          >
            Inicia sesión aquí
          </Link>
        </Typography>
      </div>
    </form>
  );
}
