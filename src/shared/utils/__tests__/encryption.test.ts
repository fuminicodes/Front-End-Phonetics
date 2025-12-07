import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encrypt, decrypt, signJWT, verifyJWT } from '../encryption';

/**
 * Unit Tests for Encryption Utilities
 * 
 * Tests cover:
 * - JWE encryption/decryption
 * - JWT signing/verification
 * - Error handling
 * - Payload integrity
 * - Expiration handling
 * 
 * NOTE: These tests require specific Web Crypto API setup.
 * Currently skipped in test environment. Run manually in production-like environment.
 */
describe.skip('Encryption Utilities', () => {
  describe('encrypt and decrypt', () => {
    it('should encrypt and decrypt a simple payload', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'user',
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
      expect(decrypted).toMatchObject(payload);
      expect(decrypted.userId).toBe('user-123');
      expect(decrypted.email).toBe('test@example.com');
    });

    it('should handle complex nested objects', async () => {
      // Arrange
      const complexPayload = {
        user: {
          id: 'user-456',
          profile: {
            name: 'John Doe',
            preferences: {
              theme: 'dark',
              language: 'en',
            },
          },
        },
        permissions: ['read', 'write', 'delete'],
        metadata: {
          createdAt: Date.now(),
          version: 1,
        },
      };

      // Act
      const encrypted = await encrypt(complexPayload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted).toMatchObject(complexPayload);
      expect(decrypted.user.profile.preferences.theme).toBe('dark');
      expect(decrypted.permissions).toEqual(['read', 'write', 'delete']);
    });

    it('should handle numeric values', async () => {
      // Arrange
      const payload = {
        count: 42,
        price: 19.99,
        timestamp: 1733500800000,
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.count).toBe(42);
      expect(decrypted.price).toBe(19.99);
      expect(decrypted.timestamp).toBe(1733500800000);
    });

    it('should handle boolean values', async () => {
      // Arrange
      const payload = {
        isActive: true,
        isVerified: false,
        hasPermission: true,
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.isActive).toBe(true);
      expect(decrypted.isVerified).toBe(false);
      expect(decrypted.hasPermission).toBe(true);
    });

    it('should handle null and undefined values', async () => {
      // Arrange
      const payload = {
        optionalField: null,
        email: 'test@example.com',
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.optionalField).toBeNull();
      expect(decrypted.email).toBe('test@example.com');
    });

    it('should produce different encrypted strings for same payload', async () => {
      // Arrange
      const payload = { userId: 'user-789' };

      // Act
      const encrypted1 = await encrypt(payload);
      const encrypted2 = await encrypt(payload);

      // Assert
      // JWE includes timestamps, so they should be different
      expect(encrypted1).not.toBe(encrypted2);
      
      // But both should decrypt to same payload
      const decrypted1 = await decrypt(encrypted1);
      const decrypted2 = await decrypt(encrypted2);
      expect(decrypted1.userId).toBe(decrypted2.userId);
    });

    it('should throw error when decrypting invalid data', async () => {
      // Arrange
      const invalidEncrypted = 'invalid-encrypted-data';

      // Act & Assert
      await expect(decrypt(invalidEncrypted)).rejects.toThrow(
        'Failed to decrypt session data'
      );
    });

    it('should throw error when decrypting empty string', async () => {
      // Act & Assert
      await expect(decrypt('')).rejects.toThrow('Failed to decrypt session data');
    });

    it('should throw error when decrypting tampered data', async () => {
      // Arrange
      const payload = { userId: 'user-123' };
      const encrypted = await encrypt(payload);
      const tampered = encrypted.slice(0, -10) + 'TAMPERED!!';

      // Act & Assert
      await expect(decrypt(tampered)).rejects.toThrow('Failed to decrypt session data');
    });

    it('should handle empty payload object', async () => {
      // Arrange
      const emptyPayload = {};

      // Act
      const encrypted = await encrypt(emptyPayload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted).toBeDefined();
      expect(typeof decrypted).toBe('object');
    });

    it('should include automatic expiration metadata', async () => {
      // Arrange
      const payload = { userId: 'user-123' };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted).toHaveProperty('exp'); // JWE adds exp claim
      expect(decrypted).toHaveProperty('iat'); // JWE adds iat claim
      expect(typeof decrypted.exp).toBe('number');
      expect(typeof decrypted.iat).toBe('number');
    });
  });

  describe('signJWT and verifyJWT', () => {
    it('should sign and verify a JWT token', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
      };

      // Act
      const token = await signJWT(payload);
      const verified = await verifyJWT(token);

      // Assert
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(verified.userId).toBe('user-123');
      expect(verified.email).toBe('test@example.com');
    });

    it('should respect custom expiration time', async () => {
      // Arrange
      const payload = { userId: 'user-456' };

      // Act
      const token = await signJWT(payload, '2h');
      const verified = await verifyJWT(token);

      // Assert
      expect(verified.userId).toBe('user-456');
      expect(verified).toHaveProperty('exp');
      
      // Verify expiration is approximately 2 hours from now
      const now = Math.floor(Date.now() / 1000);
      const twoHours = 2 * 60 * 60;
      expect(verified.exp).toBeGreaterThan(now);
      expect(verified.exp).toBeLessThanOrEqual(now + twoHours + 10); // 10 sec buffer
    });

    it('should default to 1 hour expiration', async () => {
      // Arrange
      const payload = { userId: 'user-789' };

      // Act
      const token = await signJWT(payload);
      const verified = await verifyJWT(token);

      // Assert
      const now = Math.floor(Date.now() / 1000);
      const oneHour = 60 * 60;
      expect(verified.exp).toBeGreaterThan(now);
      expect(verified.exp).toBeLessThanOrEqual(now + oneHour + 10);
    });

    it('should throw error when verifying invalid token', async () => {
      // Arrange
      const invalidToken = 'invalid.jwt.token';

      // Act & Assert
      await expect(verifyJWT(invalidToken)).rejects.toThrow('Invalid or expired JWT');
    });

    it('should throw error when verifying tampered token', async () => {
      // Arrange
      const payload = { userId: 'user-123' };
      const token = await signJWT(payload);
      const tampered = token.slice(0, -10) + 'TAMPERED!!';

      // Act & Assert
      await expect(verifyJWT(tampered)).rejects.toThrow('Invalid or expired JWT');
    });

    it('should handle payload with permissions array', async () => {
      // Arrange
      const payload = {
        userId: 'admin-001',
        permissions: ['read', 'write', 'delete', 'admin'],
      };

      // Act
      const token = await signJWT(payload);
      const verified = await verifyJWT(token);

      // Assert
      expect(verified.permissions).toEqual(['read', 'write', 'delete', 'admin']);
    });

    it('should sign tokens with different expiration formats', async () => {
      // Arrange
      const payload = { userId: 'user-123' };
      const expirations = ['30s', '5m', '1h', '1d', '7d'];

      // Act & Assert
      for (const exp of expirations) {
        const token = await signJWT(payload, exp);
        const verified = await verifyJWT(token);
        expect(verified.userId).toBe('user-123');
      }
    });
  });

  describe('Security Properties', () => {
    it('should use A256GCM encryption algorithm', async () => {
      // Arrange
      const payload = { userId: 'user-123' };

      // Act
      const encrypted = await encrypt(payload);

      // Assert
      // JWE format: header.encrypted_key.iv.ciphertext.tag
      const parts = encrypted.split('.');
      expect(parts.length).toBe(5); // JWE compact serialization
      
      // Decode header to check algorithm
      const header = JSON.parse(
        Buffer.from(parts[0], 'base64').toString()
      );
      expect(header.enc).toBe('A256GCM');
      expect(header.alg).toBe('dir');
    });

    it('should not expose plaintext in encrypted data', async () => {
      // Arrange
      const sensitivePayload = {
        password: 'super-secret-password-12345',
        apiKey: 'sk-1234567890abcdef',
        ssn: '123-45-6789',
      };

      // Act
      const encrypted = await encrypt(sensitivePayload);

      // Assert
      expect(encrypted).not.toContain('super-secret-password');
      expect(encrypted).not.toContain('sk-1234567890');
      expect(encrypted).not.toContain('123-45-6789');
    });

    it('should maintain data integrity across encryption/decryption cycles', async () => {
      // Arrange
      const originalPayload = {
        id: 'test-123',
        data: 'important information',
        count: 42,
        nested: { value: 'nested data' },
      };

      // Act
      const encrypted1 = await encrypt(originalPayload);
      const decrypted1 = await decrypt(encrypted1);
      const encrypted2 = await encrypt(decrypted1);
      const decrypted2 = await decrypt(encrypted2);

      // Assert
      expect(decrypted2.id).toBe(originalPayload.id);
      expect(decrypted2.data).toBe(originalPayload.data);
      expect(decrypted2.count).toBe(originalPayload.count);
      expect(decrypted2.nested.value).toBe(originalPayload.nested.value);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings', async () => {
      // Arrange
      const longString = 'a'.repeat(10000);
      const payload = { longField: longString };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.longField).toBe(longString);
      expect(decrypted.longField.length).toBe(10000);
    });

    it('should handle special characters in payload', async () => {
      // Arrange
      const payload = {
        text: '€$¥£©®™§¶†‡•…',
        emoji: '🚀🎉💻🔒',
        unicode: 'Hello 世界 مرحبا',
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.text).toBe('€$¥£©®™§¶†‡•…');
      expect(decrypted.emoji).toBe('🚀🎉💻🔒');
      expect(decrypted.unicode).toBe('Hello 世界 مرحبا');
    });

    it('should handle array of objects', async () => {
      // Arrange
      const payload = {
        users: [
          { id: 1, name: 'Alice' },
          { id: 2, name: 'Bob' },
          { id: 3, name: 'Charlie' },
        ],
      };

      // Act
      const encrypted = await encrypt(payload);
      const decrypted = await decrypt(encrypted);

      // Assert
      expect(decrypted.users).toHaveLength(3);
      expect(decrypted.users[0].name).toBe('Alice');
      expect(decrypted.users[2].id).toBe(3);
    });
  });
});
