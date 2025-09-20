import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, API_HEADERS } from '../config/api';

// Type definitions for the logging middleware
export type Stack = 'backend' | 'frontend';
export type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type PackageType = 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'db' | 'handler';

export interface LogEntry {
  stack: Stack;
  level: Level;
  package: PackageType;
  message: string;
}

export interface LogResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

/**
 * Reusable logging function that sends logs to the evaluation server
 * @param stack - The stack type (backend or frontend)
 * @param level - The log level (debug, info, warn, error, fatal)
 * @param packageType - The package/module type
 * @param message - Detailed contextual message describing the event/error
 * @returns Promise<LogResponse> - Response from the logging server
 */
export async function Log(
  stack: Stack,
  level: Level,
  packageType: PackageType,
  message: string
): Promise<LogResponse> {
  const logEntry: LogEntry = {
    stack,
    level,
    package: packageType,
    message
  };

  try {
    const response: AxiosResponse<LogResponse> = await axios.post(
      `${API_CONFIG.BASE_URL}${API_CONFIG.LOGS_ENDPOINT}`,
      logEntry,
      {
        headers: API_HEADERS,
        timeout: 5000, // 5 second timeout
      }
    );

    return {
      success: true,
      message: response.data.message || 'Log sent successfully',
      timestamp: response.data.timestamp || new Date().toISOString()
    };
  } catch (error) {
    // If logging fails, we don't want to break the application
    // Log to console as fallback (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to send log to evaluation server:', error);
      console.log('Log entry that failed:', logEntry);
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Convenience functions for different log levels
 */
export const Logger = {
  debug: (stack: Stack, packageType: PackageType, message: string) => 
    Log(stack, 'debug', packageType, message),
  
  info: (stack: Stack, packageType: PackageType, message: string) => 
    Log(stack, 'info', packageType, message),
  
  warn: (stack: Stack, packageType: PackageType, message: string) => 
    Log(stack, 'warn', packageType, message),
  
  error: (stack: Stack, packageType: PackageType, message: string) => 
    Log(stack, 'error', packageType, message),
  
  fatal: (stack: Stack, packageType: PackageType, message: string) => 
    Log(stack, 'fatal', packageType, message),
};

// Default export
export default Log;
