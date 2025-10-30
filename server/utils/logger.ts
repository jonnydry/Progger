/**
 * Structured logging utility
 * Provides consistent log formatting with timestamps and log levels
 */

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const levelUpper = level.toUpperCase().padEnd(5);
    const contextStr = context ? ` ${JSON.stringify(context)}` : '';
    return `[${levelUpper}] ${timestamp} ${message}${contextStr}`;
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext: LogContext = { ...context };
    
    if (error instanceof Error) {
      errorContext.error = {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    } else if (error) {
      errorContext.error = error;
    }
    
    console.error(this.formatMessage('error', message, errorContext));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  info(message: string, context?: LogContext): void {
    console.log(this.formatMessage('info', message, context));
  }

  debug(message: string, context?: LogContext): void {
    // Only log debug messages in development
    if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
      console.log(this.formatMessage('debug', message, context));
    }
  }
}

// Export singleton instance
export const logger = new Logger();

