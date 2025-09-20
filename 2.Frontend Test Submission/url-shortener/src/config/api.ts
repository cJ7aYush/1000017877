// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://20.244.56.144',
  LOGS_ENDPOINT: '/evaluation-service/logs',
  URL_SHORTENER_ENDPOINT: '/evaluation-service/shorten', // Assuming this endpoint exists
  AUTH_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVh...',
  CLIENT_ID: 'cd4e7cc5-ad5d-4a92-b0aa-a99a8588fcbd',
  CLIENT_SECRET: 'EqZgWnnUjAFdbamQ',
  ACCESS_CODE: 'Skmnew',
  USER_EMAIL: '1000017877@dit.edu.in',
  USER_NAME: 'Ayush Singh Kohli',
  ROLL_NO: '1000017877'
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${API_CONFIG.AUTH_TOKEN}`,
  'X-Client-ID': API_CONFIG.CLIENT_ID,
  'X-Client-Secret': API_CONFIG.CLIENT_SECRET
};
