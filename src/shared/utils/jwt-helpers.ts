import { SignJWT, jwtVerify } from 'jose';
import { appConfig } from '@/core/config/app.config';

const JWT_SECRET = new TextEncoder().encode(appConfig.JWT_SECRET!);

interface CustomJWTPayload {
  userId: string;
  email?: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export class JWTManager {
  /**
   * Crea un JWT firmado para uso interno del BFF
   */
  static async createToken(payload: Omit<CustomJWTPayload, 'iat' | 'exp'>, expiresIn: string = '1h'): Promise<string> {
    try {
      return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime(expiresIn)
        .setIssuer('next-bff')
        .setAudience('internal')
        .sign(JWT_SECRET);
    } catch (error) {
      throw new Error('Failed to create JWT token');
    }
  }
  
  /**
   * Verifica y decodifica un JWT token
   */
  static async verifyToken(token: string): Promise<CustomJWTPayload> {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET, {
        issuer: 'next-bff',
        audience: 'internal',
      });
      
      return payload as unknown as CustomJWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired JWT token');
    }
  }
  
  /**
   * Extrae información del token sin verificar (solo para debugging)
   */
  static decodeTokenUnsafe(token: string): CustomJWTPayload | null {
    try {
      const [, payloadBase64] = token.split('.');
      const payload = JSON.parse(atob(payloadBase64));
      return payload as unknown as CustomJWTPayload;
    } catch {
      return null;
    }
  }
}