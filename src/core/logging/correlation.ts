import { headers } from 'next/headers';

export class CorrelationManager {
  private static HEADER_NAME = 'x-request-id';
  
  static generate(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  static async getCurrent(): Promise<string> {
    try {
      const headersList = await headers();
      return headersList.get(this.HEADER_NAME) || this.generate();
    } catch (error) {
      // Fallback if headers() is not available (e.g., in client-side code)
      return this.generate();
    }
  }
  
  static async getHeaders(existingHeaders?: HeadersInit): Promise<HeadersInit> {
    const correlationId = await this.getCurrent();
    
    return {
      ...existingHeaders,
      [this.HEADER_NAME]: correlationId,
    };
  }
}