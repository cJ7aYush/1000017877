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
 * @param package - The package/module type
 * @param message - Detailed contextual message describing the event/error
 * @returns Promise<LogResponse> - Response from the logging server
 */
export declare function Log(stack: Stack, level: Level, packageType: PackageType, message: string): Promise<LogResponse>;
/**
 * Convenience functions for different log levels
 */
export declare const Logger: {
    debug: (stack: Stack, packageType: PackageType, message: string) => Promise<LogResponse>;
    info: (stack: Stack, packageType: PackageType, message: string) => Promise<LogResponse>;
    warn: (stack: Stack, packageType: PackageType, message: string) => Promise<LogResponse>;
    error: (stack: Stack, packageType: PackageType, message: string) => Promise<LogResponse>;
    fatal: (stack: Stack, packageType: PackageType, message: string) => Promise<LogResponse>;
};
export default Log;
//# sourceMappingURL=index.d.ts.map