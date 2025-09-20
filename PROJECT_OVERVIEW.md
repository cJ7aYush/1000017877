# URL Shortener Project - Complete Implementation

This project contains two main components as requested:

## 📁 1.Logging Middleware with reusable package

A TypeScript logging middleware that sends logs to the evaluation server with full API integration.

### Features:
- ✅ TypeScript implementation
- ✅ Reusable `Log(stack, level, packageType, message)` function
- ✅ POST requests to `http://20.244.56.144/evaluation-service/logs`
- ✅ **API Authentication** with Bearer token and client credentials
- ✅ Proper request body format with all required fields
- ✅ Detailed, contextual logging (not generic messages)
- ✅ Handles success, info, debug, warnings, errors, and fatal logs
- ✅ Error handling with graceful fallbacks
- ✅ Convenience methods for different log levels
- ✅ **Integrated with provided API credentials**

### Files:
- `src/index.ts` - Main logging implementation with API integration
- `package.json` - Dependencies and build scripts
- `tsconfig.json` - TypeScript configuration
- `README.md` - Documentation and usage examples
- `demo.js` - Demo script to test the middleware
- `test-api.js` - API integration test script

### Usage Example:
```typescript
import Log from './dist/index';

// All logs are sent to the evaluation server with proper authentication
await Log('backend', 'error', 'handler', 'received string, expected bool');
await Log('backend', 'fatal', 'db', 'Critical database connection failure.');
await Log('frontend', 'info', 'component', 'React component mounted successfully');
```

### API Integration:
- **Authentication**: Bearer token + Client ID/Secret
- **Endpoint**: `http://20.244.56.144/evaluation-service/logs`
- **User**: Ayush Singh Kohli (1000017877@dit.edu.in)
- **Roll No**: 1000017877
- **Client ID**: cd4e7cc5-ad5d-4a92-b0aa-a99a8588fcbd

## 📁 2.Frontend Test Submission

A React URL shortener application with comprehensive logging integration.

### Features:
- ✅ React with TypeScript
- ✅ Runs on http://localhost:3000
- ✅ Material UI interface
- ✅ No console.log() - uses custom logging middleware
- ✅ Up to 5 concurrent URLs
- ✅ Client-side validation
- ✅ Statistics page with click logs
- ✅ Redirection handling
- ✅ Production-ready code

### Pages Implemented:

#### 🔹 URL Shortener Page
- Input fields for original URL, validity period (default 30 min), custom shortcode
- Client-side validation (valid URL, integer validity)
- Displays shortened links with expiry dates
- Copy functionality for shortened URLs
- Real-time error handling and success messages

#### 🔹 URL Statistics Page
- Overview dashboard with total URLs, active URLs, and click counts
- Detailed table view of all shortened URLs
- Click logs with timestamp, source, and geo-location
- Export and management capabilities
- Real-time data updates

#### 🔹 Redirection Handling
- Automatic redirection for valid shortcodes (`/shortcode`)
- Graceful error handling for invalid/expired shortcodes
- Click tracking and logging for each redirect

### Mandatory Logging Integration:
Every major action is logged via the middleware:

```typescript
// Example log calls throughout the app:
Logger.info('frontend', 'api', 'shorten URL request initiated');
Logger.warn('frontend', 'component', 'invalid URL format entered by user');
Logger.error('frontend', 'hook', 'shortcode collision detected');
Logger.debug('frontend', 'page', 'user redirected to original URL successfully');
```

### Technical Stack:
- **Frontend**: React 19, TypeScript, Material-UI
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: React hooks
- **Logging**: Custom middleware integration

### Project Structure:
```
2.Frontend Test Submission/url-shortener/
├── src/
│   ├── components/
│   │   ├── UrlShortener.tsx      # Main shortening interface
│   │   ├── Statistics.tsx        # Statistics dashboard
│   │   └── RedirectHandler.tsx   # URL redirection logic
│   ├── services/
│   │   └── urlService.ts         # URL management service
│   ├── types/
│   │   └── index.ts              # TypeScript definitions
│   ├── utils/
│   │   └── logger.ts             # Logging middleware
│   └── App.tsx                   # Main app with routing
├── package.json
└── README.md
```

## 🚀 Getting Started

### 1. Logging Middleware
```bash
cd "1.Logging Middleware with reusable package"
npm install
npm run build
node demo.js  # Test the middleware
```

### 2. React URL Shortener
```bash
cd "2.Frontend Test Submission/url-shortener"
npm install
npm start  # Runs on http://localhost:3000
```

## ✅ Requirements Compliance

### Logging Middleware:
- ✅ TypeScript/JavaScript implementation
- ✅ Exports reusable Log function
- ✅ POST requests to evaluation server
- ✅ Correct request body format
- ✅ Detailed, contextual logs
- ✅ Handles all log levels (debug, info, warn, error, fatal)
- ✅ Example usage provided

### React URL Shortener:
- ✅ React with TypeScript
- ✅ Runs on http://localhost:3000
- ✅ Material UI interface
- ✅ No console.log() - uses custom logging
- ✅ Up to 5 concurrent URLs
- ✅ Client-side validation
- ✅ Statistics page with click logs
- ✅ Redirection handling
- ✅ Comprehensive logging integration
- ✅ Production-ready code

## 📊 Logging Examples

The application logs every significant action:

- **URL Shortening**: Request initiation, validation, success/failure
- **User Interactions**: Form submissions, navigation, clicks
- **Validation Errors**: Invalid URLs, expired codes, limit reached
- **System Events**: Page loads, redirects, API calls
- **Error Handling**: Network failures, unexpected errors

All logs are sent to the evaluation server with proper categorization by stack, level, package, and detailed contextual messages.

## 🎯 Key Features

1. **Comprehensive Logging**: Every action is logged with detailed context
2. **User-Friendly Interface**: Modern Material UI design
3. **Robust Validation**: Client-side validation with clear error messages
4. **Real-time Statistics**: Live updates of click counts and performance
5. **Graceful Error Handling**: Proper error states and user feedback
6. **Production Ready**: Clean, modular, well-documented code

Both components are fully functional and ready for evaluation!
