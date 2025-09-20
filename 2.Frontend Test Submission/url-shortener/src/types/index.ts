export interface ShortenedUrl {
  id: string;
  originalUrl: string;
  shortCode: string;
  shortUrl: string;
  createdAt: Date;
  expiresAt: Date;
  clickCount: number;
  clickLogs: ClickLog[];
}

export interface ClickLog {
  id: string;
  shortCode: string;
  timestamp: Date;
  source: string;
  geoLocation: {
    country?: string;
    city?: string;
    region?: string;
  };
  userAgent?: string;
  ipAddress?: string;
}

export interface UrlShortenRequest {
  originalUrl: string;
  validityMinutes?: number;
  customShortCode?: string;
}

export interface UrlShortenResponse {
  success: boolean;
  data?: ShortenedUrl;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
