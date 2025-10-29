/**
 * Processing Configuration System
 * Allows configurable behavior for music theory processing pipeline
 */

export interface ProcessingConfiguration {
  /** Enable smart fallback to similar chords when exact match not found */
  enableSmartFallbacks: boolean;

  /** Process chords and scales in parallel for better performance */
  enableParallelProcessing: boolean;

  /** Include detailed chord analysis in results */
  enableDetailedAnalysis: boolean;

  /** Cache intermediate computation results to avoid recalculation */
  cacheIntermediateResults: boolean;

  /** Enable automatic recovery from recoverable errors */
  enableAutoRecovery: boolean;

  /** Timeout for API calls in milliseconds */
  apiTimeoutMs: number;

  /** Maximum number of retry attempts for failed operations */
  maxRetryAttempts: number;

  /** Log level for debug information */
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Default configuration for production use
 */
export const DEFAULT_PROCESSING_CONFIG: ProcessingConfiguration = {
  enableSmartFallbacks: true,
  enableParallelProcessing: true,
  enableDetailedAnalysis: true,
  cacheIntermediateResults: true,
  enableAutoRecovery: true,
  apiTimeoutMs: 30000, // 30 seconds
  maxRetryAttempts: 3,
  logLevel: 'info'
};

/**
 * Development configuration with more logging and debugging
 */
export const DEVELOPMENT_CONFIG: ProcessingConfiguration = {
  ...DEFAULT_PROCESSING_CONFIG,
  logLevel: 'debug',
  // Other settings can be overridden here
};

/**
 * Get the current processing configuration based on environment
 */
export function getProcessingConfig(): ProcessingConfiguration {
  // In a browser environment, we can check for development mode
  // For now, default to production config, but this can be extended
  const isDevelopment = process.env.NODE_ENV === 'development' ||
                       window.location.hostname === 'localhost' ||
                       window.location.hostname === '127.0.0.1';

  return isDevelopment ? DEVELOPMENT_CONFIG : DEFAULT_PROCESSING_CONFIG;
}

/**
 * Update specific configuration values
 */
export function updateProcessingConfig(updates: Partial<ProcessingConfiguration>): void {
  // In a real implementation, this could persist to localStorage
  // For now, it would need to be handled at the application level
  console.warn('Configuration updates not yet implemented. Use the config object directly.');
}

/**
 * Create a custom configuration for specific use cases
 */
export function createCustomConfig(overrides: Partial<ProcessingConfiguration>): ProcessingConfiguration {
  return {
    ...DEFAULT_PROCESSING_CONFIG,
    ...overrides
  };
}

/**
 * Validate configuration object
 */
export function validateConfig(config: ProcessingConfiguration): boolean {
  const requiredFields: (keyof ProcessingConfiguration)[] = [
    'enableSmartFallbacks',
    'enableParallelProcessing',
    'enableDetailedAnalysis',
    'cacheIntermediateResults',
    'enableAutoRecovery',
    'apiTimeoutMs',
    'maxRetryAttempts',
    'logLevel'
  ];

  for (const field of requiredFields) {
    if (!(field in config)) {
      console.error(`Missing required configuration field: ${field}`);
      return false;
    }

    // Type validation for specific fields
    if (field === 'apiTimeoutMs' && (typeof config[field] !== 'number' || config[field] <= 0)) {
      console.error(`Invalid apiTimeoutMs: must be a positive number`);
      return false;
    }

    if (field === 'maxRetryAttempts' && (typeof config[field] !== 'number' || config[field] < 0)) {
      console.error(`Invalid maxRetryAttempts: must be a non-negative number`);
      return false;
    }

    if (field === 'logLevel' && !['error', 'warn', 'info', 'debug'].includes(config[field])) {
      console.error(`Invalid logLevel: must be one of 'error', 'warn', 'info', 'debug'`);
      return false;
    }
  }

  return true;
}
