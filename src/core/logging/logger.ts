import { CorrelationManager } from './correlation';

interface LogContext {
  correlationId?: string;
  userId?: string;
  action?: string;
  resource?: string;
  metadata?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  // Request context fields
  method?: string;
  url?: string;
  userAgent?: string | number | null;
  path?: string;
  status?: number;
  duration?: string;
  headerSize?: number;
  fileName?: string;
  fileSize?: number;
  options?: any;
  analysisId?: string;
  accuracy?: number;
  phonemeCount?: number;
  cookie?: number;
  total?: number;
  statusText?: string;
  errorDetails?: string;
  // Authentication context fields
  email?: string;
  reason?: string;
  // Debug context fields
  formDataEntries?: any[];
  externalFormDataEntries?: any[];
  externalApiData?: any;
  availableKeys?: string[];
  fileType?: string;
  errorBody?: string;
}

class Logger {
  private async getCorrelationId(): Promise<string> {
    try {
      return await CorrelationManager.getCurrent();
    } catch {
      return CorrelationManager.generate();
    }
  }
  
  private async formatMessage(level: string, message: string, context?: LogContext): Promise<string> {
    const correlationId = context?.correlationId || await this.getCorrelationId();
    
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      message,
      correlationId,
      ...context,
    });
  }
  
  async info(message: string, context?: LogContext) {
    const formatted = await this.formatMessage('info', message, context);
    console.log(formatted);
  }
  
  async warn(message: string, context?: LogContext) {
    const formatted = await this.formatMessage('warn', message, context);
    console.warn(formatted);
  }
  
  async error(message: string, error?: Error, context?: LogContext) {
    const formatted = await this.formatMessage('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
    });
    console.error(formatted);
  }
  
  async debug(message: string, context?: LogContext) {
    if (process.env.NODE_ENV === 'development') {
      const formatted = await this.formatMessage('debug', message, context);
      console.debug(formatted);
    }
  }
}

export const logger = new Logger();