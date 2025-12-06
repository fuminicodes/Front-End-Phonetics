import { cookies } from 'next/headers';
import { encrypt, decrypt } from './encryption';
import { z } from 'zod';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

const SessionDataSchema = z.object({
  userId: z.string(),
  email: z.string().optional(),
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresAt: z.number(),
  permissions: z.array(z.string()).optional()
});

export type SessionData = z.infer<typeof SessionDataSchema>;

export class SessionManager {
  // Use __Secure- prefix only in production (HTTPS required)
  // In development, use regular name to avoid browser warnings
  private static COOKIE_NAME = process.env.NODE_ENV === 'production' 
    ? '__Secure-session' 
    : 'session';
  
  static async setSession(data: SessionData): Promise<void> {
    try {
      const encrypted = await encrypt(data);
      
      const cookieStore = await cookies();
      
      const cookieOptions: Partial<ResponseCookie> = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      };
      
      cookieStore.set(this.COOKIE_NAME, encrypted, cookieOptions);
    } catch (error) {
      console.error('Error setting session:', error);
      throw new Error('Failed to create session');
    }
  }
  
  static async getSession(): Promise<SessionData | null> {
    try {
      const cookieStore = await cookies();
      const encrypted = cookieStore.get(this.COOKIE_NAME)?.value;
      
      if (!encrypted) {
        return null;
      }
      
      const decrypted = await decrypt(encrypted);
      const validated = SessionDataSchema.parse(decrypted);
      
      // JWE handles expiration automatically through 'exp' claim
      // Additional check for custom expiresAt if needed
      if (validated.expiresAt && Date.now() > validated.expiresAt) {
        await this.clearSession();
        return null;
      }
      
      return validated;
    } catch (error) {
      console.error('Error reading session:', error);
      await this.clearSession();
      return null;
    }
  }
  
  static async clearSession(): Promise<void> {
    try {
      const cookieStore = await cookies();
      cookieStore.delete(this.COOKIE_NAME);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}