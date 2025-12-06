'use server';

import { redirect } from 'next/navigation';
import { SessionManager } from '@/shared/utils/session';
import { signJWT } from '@/shared/utils/encryption';
import { CorrelationManager } from '@/core/logging/correlation';
import { logger } from '@/core/logging/logger';
import { z } from 'zod';

// ===== VALIDATION SCHEMAS =====

const LoginFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida'),
});

const RegisterFormSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

// ===== TYPE DEFINITIONS =====

export type LoginActionState = {
  errors?: {
    email?: string[];
    password?: string[];
    _form?: string[];
  };
  success?: boolean;
};

export type RegisterActionState = {
  errors?: {
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
    firstName?: string[];
    lastName?: string[];
    _form?: string[];
  };
  success?: boolean;
};

// ===== LOGIN ACTION =====

/**
 * Server Action for user login
 * 
 * @param prevState - Previous form state
 * @param formData - Form data containing email and password
 * @returns Login state with success or error information
 */
export async function loginAction(
  prevState: LoginActionState,
  formData: FormData
): Promise<LoginActionState> {
  const correlationId = CorrelationManager.generate();
  
  try {
    // 1. Validate form data
    const validatedFields = LoginFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });
    
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { email, password } = validatedFields.data;
    
    await logger.info('Login attempt started', {
      correlationId,
      email,
      action: 'login',
    });
    
    // 2. Call authentication microservice (if exists) or mock for now
    // TODO: Replace with actual auth service call
    const authResponse = await mockAuthService(email, password);
    
    if (!authResponse.success) {
      await logger.warn('Login failed - Invalid credentials', {
        correlationId,
        email,
      });
      
      return {
        errors: {
          _form: ['Credenciales inválidas. Verifica tu email y contraseña.'],
        },
      };
    }
    
    // 3. Create internal JWT token using jose
    const internalJWT = await signJWT({
      userId: authResponse.user.id,
      email: authResponse.user.email,
      permissions: authResponse.user.permissions,
    }, '7d');
    
    // 4. Create encrypted session with JWE
    await SessionManager.setSession({
      userId: authResponse.user.id,
      email: authResponse.user.email,
      accessToken: internalJWT,
      refreshToken: authResponse.refreshToken,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
      permissions: authResponse.user.permissions,
    });
    
    await logger.info('Login successful', {
      correlationId,
      userId: authResponse.user.id,
      email: authResponse.user.email,
    });
    
  } catch (error) {
    await logger.error('Login error', error as Error, {
      correlationId,
      action: 'login',
    });
    
    return {
      errors: {
        _form: ['Error interno del servidor. Inténtalo de nuevo más tarde.'],
      },
    };
  }
  
  // 5. Get return URL from query params or default to dashboard
  const returnUrl = formData.get('returnUrl') as string || '/';
  
  // Redirect outside try-catch (Next.js requirement)
  redirect(returnUrl);
}

// ===== REGISTER ACTION =====

/**
 * Server Action for user registration
 * 
 * @param prevState - Previous form state
 * @param formData - Form data containing user information
 * @returns Register state with success or error information
 */
export async function registerAction(
  prevState: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> {
  const correlationId = CorrelationManager.generate();
  
  try {
    // 1. Validate form data
    const validatedFields = RegisterFormSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
    });
    
    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      };
    }
    
    const { email, password, firstName, lastName } = validatedFields.data;
    
    await logger.info('Registration attempt started', {
      correlationId,
      email,
      action: 'register',
    });
    
    // 2. Call registration microservice (if exists) or mock for now
    // TODO: Replace with actual registration service call
    const registerResponse = await mockRegisterService(email, password, firstName, lastName);
    
    if (!registerResponse.success) {
      await logger.warn('Registration failed', {
        correlationId,
        email,
        reason: registerResponse.error,
      });
      
      return {
        errors: {
          _form: [registerResponse.error || 'Error al crear la cuenta.'],
        },
      };
    }
    
    await logger.info('Registration successful', {
      correlationId,
      userId: registerResponse.user.id,
      email: registerResponse.user.email,
    });
    
    // 3. Automatically log in the user
    const internalJWT = await signJWT({
      userId: registerResponse.user.id,
      email: registerResponse.user.email,
      permissions: registerResponse.user.permissions,
    }, '7d');
    
    await SessionManager.setSession({
      userId: registerResponse.user.id,
      email: registerResponse.user.email,
      accessToken: internalJWT,
      refreshToken: registerResponse.refreshToken,
      expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000),
      permissions: registerResponse.user.permissions,
    });
    
  } catch (error) {
    await logger.error('Registration error', error as Error, {
      correlationId,
      action: 'register',
    });
    
    return {
      errors: {
        _form: ['Error interno del servidor. Inténtalo de nuevo más tarde.'],
      },
    };
  }
  
  // Redirect to dashboard after successful registration
  redirect('/');
}

// ===== LOGOUT ACTION =====

/**
 * Server Action for user logout
 */
export async function logoutAction(): Promise<void> {
  const correlationId = CorrelationManager.generate();
  
  try {
    const session = await SessionManager.getSession();
    
    if (session) {
      await logger.info('Logout initiated', {
        correlationId,
        userId: session.userId,
        action: 'logout',
      });
    }
    
    await SessionManager.clearSession();
    
  } catch (error) {
    await logger.error('Logout error', error as Error, {
      correlationId,
      action: 'logout',
    });
  }
  
  redirect('/login');
}

// ===== MOCK SERVICES (Replace with actual API calls) =====

interface MockAuthResponse {
  success: boolean;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    permissions: string[];
  };
  refreshToken: string;
  error?: string;
}

async function mockAuthService(email: string, password: string): Promise<MockAuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock authentication logic
  // TODO: Replace with actual API call to authentication microservice
  if (password === 'password' || password === 'demo123') {
    return {
      success: true,
      user: {
        id: `user_${Date.now()}`,
        email: email,
        firstName: 'Demo',
        lastName: 'User',
        permissions: ['phoneme:analyze', 'phoneme:read', 'audio:record'],
      },
      refreshToken: 'mock_refresh_token',
    };
  }
  
  return {
    success: false,
    user: {} as any,
    refreshToken: '',
    error: 'Invalid credentials',
  };
}

async function mockRegisterService(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<MockAuthResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Mock registration logic
  // TODO: Replace with actual API call to registration microservice
  
  // Check if email already exists (mock check)
  if (email === 'existing@example.com') {
    return {
      success: false,
      user: {} as any,
      refreshToken: '',
      error: 'Este email ya está registrado.',
    };
  }
  
  return {
    success: true,
    user: {
      id: `user_${Date.now()}`,
      email: email,
      firstName: firstName,
      lastName: lastName,
      permissions: ['phoneme:analyze', 'phoneme:read', 'audio:record'],
    },
    refreshToken: 'mock_refresh_token',
  };
}
