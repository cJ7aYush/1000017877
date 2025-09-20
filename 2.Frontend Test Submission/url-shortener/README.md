# React URL Shortener

A modern React application for shortening URLs with comprehensive logging and statistics tracking.

## Features

- **URL Shortening**: Shorten up to 5 URLs concurrently
- **Custom Short Codes**: Optional custom short codes with uniqueness validation
- **Validity Periods**: Configurable expiration times (1-1440 minutes)
- **Statistics Dashboard**: View click counts, creation dates, and detailed click logs
- **Real-time Redirects**: Automatic redirection for valid short codes
- **Comprehensive Logging**: All actions logged via custom middleware
- **Material UI**: Modern, responsive interface

## Pages

### 1. URL Shortener Page
- Input form for original URL, validity period, and custom short code
- Client-side validation for URL format and input constraints
- Display of shortened URLs with copy functionality
- Real-time status updates and error handling

### 2. URL Statistics Page
- Overview dashboard with total URLs, active URLs, and click counts
- Detailed table view of all shortened URLs
- Click logs with timestamp, source, and geo-location data
- Export and management capabilities

### 3. Redirection Handling
- Automatic redirection for valid short codes
- Graceful error handling for invalid/expired codes
- Click tracking and logging

## Logging Integration

The application uses a custom logging middleware that sends detailed logs to the evaluation server:

- **Success Messages**: URL shortening, successful redirects
- **Info/Debug Traces**: Page navigation, API calls, user interactions
- **Warnings**: Validation errors, expired URLs, limit reached
- **Errors**: API failures, invalid inputs, system errors

### Example Log Calls

```typescript
Logger.info('frontend', 'api', 'URL shortening request initiated');
Logger.warn('frontend', 'component', 'Invalid URL format entered by user');
Logger.error('frontend', 'hook', 'Shortcode collision detected');
Logger.debug('frontend', 'page', 'User redirected to original URL successfully');
```

## Installation & Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Shorten URLs**: Enter a valid URL, set validity period (default 30 minutes), optionally provide a custom short code
2. **View Statistics**: Switch to the Statistics tab to see all shortened URLs and their performance
3. **Access Short URLs**: Visit `http://localhost:3000/{shortCode}` to be redirected to the original URL

## Technical Details

- **Framework**: React 19 with TypeScript
- **UI Library**: Material-UI (MUI)
- **Routing**: React Router DOM
- **State Management**: React hooks and local state
- **HTTP Client**: Axios
- **Logging**: Custom middleware with evaluation server integration

## Project Structure

```
src/
├── components/
│   ├── UrlShortener.tsx      # Main URL shortening interface
│   ├── Statistics.tsx        # Statistics dashboard
│   └── RedirectHandler.tsx   # URL redirection logic
├── services/
│   └── urlService.ts         # URL management service
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   └── logger.ts             # Logging middleware
└── App.tsx                   # Main application component
```

## Requirements Compliance

✅ Built with React and TypeScript  
✅ Runs on http://localhost:3000  
✅ Uses Material UI for interface  
✅ No console.log() - uses custom logging middleware  
✅ Supports up to 5 concurrent URLs  
✅ Client-side validation  
✅ Statistics page with click logs  
✅ Redirection handling  
✅ Comprehensive logging integration  
✅ Production-ready code