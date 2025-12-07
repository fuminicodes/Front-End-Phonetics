import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { webcrypto } from 'node:crypto';

// Polyfill Web Crypto API for jose library
if (!globalThis.crypto) {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    writable: false,
    configurable: false,
  });
}

// Set environment variables for tests
beforeAll(() => {
  // Use vi.stubEnv for better compatibility with Vitest
  vi.stubEnv('NODE_ENV', 'development');
  vi.stubEnv('NEXTAUTH_SECRET', 'test-secret-key-min-32-characters-long');
  vi.stubEnv('SESSION_ENCRYPTION_KEY', '12345678901234567890123456789012');
  vi.stubEnv('JWT_SECRET', 'test-jwt-secret-min-32-chars-long');
  vi.stubEnv('API_BASE_URL', 'http://localhost:3001');
  vi.stubEnv('PHONEME_ANALYSIS_API_URL', 'http://localhost:3002');
  vi.stubEnv('FF_NEW_PHONEME_ANALYSIS', 'false');
  vi.stubEnv('FF_ADVANCED_ANALYTICS', 'false');
  vi.stubEnv('FF_MAINTENANCE_MODE', 'false');
});

// Cleanup after each test case (e.g. clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock File API for Node.js environment
global.File = class File {
  name: string;
  type: string;
  size: number;
  lastModified: number;
  
  constructor(bits: BlobPart[], name: string, options?: FilePropertyBag) {
    this.name = name;
    this.type = options?.type || '';
    this.size = bits.reduce((acc, bit) => {
      if (typeof bit === 'string') return acc + bit.length;
      if (bit instanceof ArrayBuffer) return acc + bit.byteLength;
      return acc;
    }, 0);
    this.lastModified = options?.lastModified || Date.now();
  }
  
  arrayBuffer(): Promise<ArrayBuffer> {
    return Promise.resolve(new ArrayBuffer(this.size));
  }
  
  text(): Promise<string> {
    return Promise.resolve('');
  }
  
  slice(): Blob {
    return new Blob([]);
  }
  
  stream(): ReadableStream {
    return new ReadableStream();
  }
} as any;
