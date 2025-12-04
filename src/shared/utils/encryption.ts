import { EncryptJWT, jwtDecrypt } from 'jose';
import { appConfig } from '@/core/config/app.config';

// Convert string to Uint8Array for jose
const JWT_SECRET = new TextEncoder().encode(appConfig.JWT_SECRET!);
const SESSION_SECRET = new TextEncoder().encode(appConfig.SESSION_ENCRYPTION_KEY!);

/**
 * Encrypts data using JWE (JSON Web Encryption)
 * More secure than native crypto for session data
 */
export async function encrypt(payload: Record<string, any>): Promise<string> {
  try {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .encrypt(SESSION_SECRET);
  } catch (error) {
    throw new Error('Failed to encrypt session data');
  }
}

/**
 * Decrypts JWE encrypted data
 */
export async function decrypt(encryptedJWE: string): Promise<Record<string, any>> {
  try {
    const { payload } = await jwtDecrypt(encryptedJWE, SESSION_SECRET);
    return payload as Record<string, any>;
  } catch (error) {
    throw new Error('Failed to decrypt session data');
  }
}

/**
 * Creates a signed JWT token (for API authentication)
 */
export async function signJWT(payload: Record<string, any>, expiresIn: string = '1h'): Promise<string> {
  try {
    return await new EncryptJWT(payload)
      .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
      .setIssuedAt()
      .setExpirationTime(expiresIn)
      .encrypt(JWT_SECRET);
  } catch (error) {
    throw new Error('Failed to sign JWT');
  }
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyJWT(token: string): Promise<Record<string, any>> {
  try {
    const { payload } = await jwtDecrypt(token, JWT_SECRET);
    return payload as Record<string, any>;
  } catch (error) {
    throw new Error('Invalid or expired JWT');
  }
}