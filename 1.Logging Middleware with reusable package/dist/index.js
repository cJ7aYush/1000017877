"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
exports.Log = Log;
const axios_1 = __importDefault(require("axios"));
// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://20.244.56.144',
    LOGS_ENDPOINT: '/evaluation-service/logs',
    AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVh...',
    CLIENT_ID: 'cd4e7cc5-ad5d-4a92-b0aa-a99a8588fcbd',
    CLIENT_SECRET: 'EqZgWnnUjAFdbamQ',
    ACCESS_CODE: 'Skmnew',
    USER_EMAIL: '1000017877@dit.edu.in',
    USER_NAME: 'Ayush Singh Kohli',
    ROLL_NO: '1000017877'
};
const API_HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_CONFIG.AUTH_TOKEN}`,
    'X-Client-ID': API_CONFIG.CLIENT_ID,
    'X-Client-Secret': API_CONFIG.CLIENT_SECRET
};
/**
 * Reusable logging function that sends logs to the evaluation server
 * @param stack - The stack type (backend or frontend)
 * @param level - The log level (debug, info, warn, error, fatal)
 * @param package - The package/module type
 * @param message - Detailed contextual message describing the event/error
 * @returns Promise<LogResponse> - Response from the logging server
 */
async function Log(stack, level, packageType, message) {
    const logEntry = {
        stack,
        level,
        package: packageType,
        message
    };
    try {
        const response = await axios_1.default.post(`${API_CONFIG.BASE_URL}${API_CONFIG.LOGS_ENDPOINT}`, logEntry, {
            headers: API_HEADERS,
            timeout: 5000, // 5 second timeout
        });
        return {
            success: true,
            message: response.data.message || 'Log sent successfully',
            timestamp: response.data.timestamp || new Date().toISOString()
        };
    }
    catch (error) {
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
exports.Logger = {
    debug: (stack, packageType, message) => Log(stack, 'debug', packageType, message),
    info: (stack, packageType, message) => Log(stack, 'info', packageType, message),
    warn: (stack, packageType, message) => Log(stack, 'warn', packageType, message),
    error: (stack, packageType, message) => Log(stack, 'error', packageType, message),
    fatal: (stack, packageType, message) => Log(stack, 'fatal', packageType, message),
};
// Default export
exports.default = Log;
//# sourceMappingURL=index.js.map