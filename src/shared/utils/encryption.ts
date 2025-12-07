import { EncryptJWT, jwtDecrypt } from 'jose';
import { appConfig } from '@/core/config/app.config';

// Default 32-byte keys for development (exactly 256 bits for A256GCM)
const DEFAULT_JWT_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
const DEFAULT_SESSION_SECRET = '12345678901234567890123456789012';

/**
 * Get session secret as Uint8Array
 * Lazily evaluated to ensure environment variables are loaded
 */
function getSessionSecret(): Uint8Array {
  return new TextEncoder().encode(appConfig.SESSION_ENCRYPTION_KEY || DEFAULT_SESSION_SECRET);
}

/**
 * Get JWT secret as Uint8Array
 * Lazily evaluated to ensure environment variables are loaded
 */
function getJWTSecret(): Uint8Array {
  return new TextEncoder().encode(appConfig.JWT_SECRET || DEFAULT_JWT_SECRET);
}

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
      .encrypt(getSessionSecret());
  } catch (error) {
    throw new Error('Failed to encrypt session data');
  }
}

/**
 * Decrypts JWE encrypted data
 */
export async function decrypt(encryptedJWE: string): Promise<Record<string, any>> {
  try {
    const { payload } = await jwtDecrypt(encryptedJWE, getSessionSecret());
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
      .encrypt(getJWTSecret());
  } catch (error) {
    throw new Error('Failed to sign JWT');
  }
}

/**
 * Verifies and decodes a JWT token
 */
export async function verifyJWT(token: string): Promise<Record<string, any>> {
  try {
    const { payload } = await jwtDecrypt(token, getJWTSecret());
    return payload as Record<string, any>;
  } catch (error) {
    throw new Error('Invalid or expired JWT');
  }
}