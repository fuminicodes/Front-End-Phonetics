/**
 * MSW Authentication Handlers
 * 
 * Mock handlers for authentication endpoints (login, register, logout)
 */

import { http, HttpResponse } from 'msw';
import { delay } from 'msw';

// Mock user database
const mockUsers = [
  {
    id: 'user_1',
    email: 'demo@ejemplo.com',
    firstName: 'Demo',
    lastName: 'User',
    password: 'password',
    permissions: ['phoneme:analyze', 'phoneme:read', 'audio:record'],
  },
  {
    id: 'user_2',
    email: 'admin@ejemplo.com',
    firstName: 'Admin',
    lastName: 'User',
    password: 'admin123',
    permissions: [
      'phoneme:analyze',
      'phoneme:read',
      'phoneme:delete',
      'audio:record',
      'audio:upload',
      'users:read',
      'users:update',
      'users:delete',
      'admin:access',
    ],
  },
  {
    id: 'user_3',
    email: 'premium@ejemplo.com',
    firstName: 'Premium',
    lastName: 'User',
    password: 'premium123',
    permissions: [
      'phoneme:analyze',
      'phoneme:read',
      'phoneme:delete',
      'audio:record',
      'audio:upload',
      'results:export',
    ],
  },
];

export const authHandlers = [
  // POST /api/auth/login
  http.post('http://localhost:5005/api/auth/login', async ({ request }) => {
    await delay(800); // Simulate network delay

    const body = await request.json();
    const { email, password } = body as { email: string; password: string };

    // Find user
    const user = mockUsers.find(u => u.email === email);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Invalid credentials',
          message: 'Email or password is incorrect',
        },
        { status: 401 }
      );
    }

    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;

    return HttpResponse.json({
      success: true,
      user: userWithoutPassword,
      refreshToken: `refresh_token_${Date.now()}`,
      message: 'Login successful',
    });
  }),

  // POST /api/auth/register
  http.post('http://localhost:5005/api/auth/register', async ({ request }) => {
    await delay(1000);

    const body = await request.json();
    const { email, password, firstName, lastName } = body as {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    };

    // Check if email already exists
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Email already exists',
          message: 'This email is already registered',
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      password,
      permissions: ['phoneme:analyze', 'phoneme:read', 'audio:record'],
    };

    mockUsers.push(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return HttpResponse.json({
      success: true,
      user: userWithoutPassword,
      refreshToken: `refresh_token_${Date.now()}`,
      message: 'Registration successful',
    });
  }),

  // POST /api/auth/refresh
  http.post('http://localhost:5005/api/auth/refresh', async ({ request }) => {
    await delay(500);

    const body = await request.json();
    const { refreshToken } = body as { refreshToken: string };

    if (!refreshToken) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Refresh token required',
        },
        { status: 400 }
      );
    }

    // For demo, always return success with demo user
    const demoUser = mockUsers[0];
    const { password: _, ...userWithoutPassword } = demoUser;

    return HttpResponse.json({
      success: true,
      user: userWithoutPassword,
      refreshToken: `refresh_token_${Date.now()}`,
    });
  }),

  // POST /api/auth/logout
  http.post('http://localhost:5005/api/auth/logout', async () => {
    await delay(300);

    return HttpResponse.json({
      success: true,
      message: 'Logout successful',
    });
  }),

  // GET /api/auth/me - Get current user
  http.get('http://localhost:5005/api/auth/me', async ({ request }) => {
    await delay(400);

    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // For demo, return demo user
    const demoUser = mockUsers[0];
    const { password: _, ...userWithoutPassword } = demoUser;

    return HttpResponse.json({
      success: true,
      user: userWithoutPassword,
    });
  }),
];
