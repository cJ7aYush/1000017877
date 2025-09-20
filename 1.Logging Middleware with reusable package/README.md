# Logging Middleware

A reusable TypeScript/JavaScript logging middleware that sends logs to the evaluation server.

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```typescript
import Log from './dist/index';

// Send a log entry
await Log('backend', 'error', 'handler', 'received string, expected bool');
await Log('backend', 'fatal', 'db', 'Critical database connection failure.');
```

### Using Logger Convenience Methods

```typescript
import { Logger } from './dist/index';

// Different log levels
await Logger.debug('frontend', 'component', 'Component mounted successfully');
await Logger.info('frontend', 'api', 'API request initiated');
await Logger.warn('frontend', 'hook', 'Deprecated hook usage detected');
await Logger.error('frontend', 'page', 'Page failed to load');
await Logger.fatal('backend', 'db', 'Database connection lost');
```

## API Reference

### Log Function

```typescript
Log(stack: Stack, level: Level, package: Package, message: string): Promise<LogResponse>
```

#### Parameters

- `stack`: `'backend' | 'frontend'` - The application stack
- `level`: `'debug' | 'info' | 'warn' | 'error' | 'fatal'` - The log level
- `packageType`: `'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'db' | 'handler'` - The package/module type
- `message`: `string` - Detailed contextual message

#### Returns

```typescript
interface LogResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}
```

## Error Handling

The middleware includes built-in error handling:
- Network timeouts (5 seconds)
- Graceful fallback to console logging in development
- Non-blocking operation (logging failures won't break your app)

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Watch mode for development
npm run dev
```
