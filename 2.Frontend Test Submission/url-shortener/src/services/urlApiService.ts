import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, API_HEADERS } from '../config/api';
import { ShortenedUrl, UrlShortenRequest, UrlShortenResponse, ClickLog } from '../types';
import { Logger } from '../utils/logger';

interface ApiShortenRequest {
  originalUrl: string;
  validityMinutes?: number;
  customShortCode?: string;
  userEmail: string;
  userName: string;
  rollNo: string;
}

interface ApiShortenResponse {
  success: boolean;
  data?: {
    id: string;
    originalUrl: string;
    shortCode: string;
    shortUrl: string;
    createdAt: string;
    expiresAt: string;
    clickCount: number;
  };
  error?: string;
  logID?: string;
}

class UrlApiService {
  private shortenedUrls: Map<string, ShortenedUrl> = new Map();
  private clickLogs: Map<string, ClickLog[]> = new Map();

  /**
   * Generate a random short code
   */
  private generateShortCode(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Check if a short code is unique
   */
  private isShortCodeUnique(shortCode: string): boolean {
    return !this.shortenedUrls.has(shortCode);
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Shorten a URL using the API
   */
  async shortenUrl(request: UrlShortenRequest): Promise<UrlShortenResponse> {
    try {
      await Logger.info('frontend', 'api', 'URL shortening request initiated');

      // Validate input
      if (!request.originalUrl) {
        await Logger.warn('frontend', 'component', 'Empty URL provided by user');
        return { success: false, error: 'URL is required' };
      }

      if (!this.isValidUrl(request.originalUrl)) {
        await Logger.warn('frontend', 'component', 'Invalid URL format entered by user');
        return { success: false, error: 'Invalid URL format' };
      }

      // Check if we already have 5 URLs
      if (this.shortenedUrls.size >= 5) {
        await Logger.warn('frontend', 'component', 'Maximum URL limit (5) reached');
        return { success: false, error: 'Maximum of 5 URLs allowed' };
      }

      // Generate or validate short code
      let shortCode: string;
      if (request.customShortCode) {
        if (!this.isShortCodeUnique(request.customShortCode)) {
          await Logger.error('frontend', 'hook', 'Shortcode collision detected');
          return { success: false, error: 'Short code already exists' };
        }
        shortCode = request.customShortCode;
      } else {
        shortCode = this.generateShortCode();
        // Ensure uniqueness
        while (!this.isShortCodeUnique(shortCode)) {
          shortCode = this.generateShortCode();
        }
      }

      // Calculate expiry time
      const validityMinutes = request.validityMinutes || 30;
      const expiresAt = new Date(Date.now() + validityMinutes * 60 * 1000);

      // Create shortened URL
      const shortenedUrl: ShortenedUrl = {
        id: Date.now().toString(),
        originalUrl: request.originalUrl,
        shortCode,
        shortUrl: `${window.location.origin}/${shortCode}`,
        createdAt: new Date(),
        expiresAt,
        clickCount: 0,
        clickLogs: []
      };

      // Store the URL locally (since we don't have a real API endpoint)
      this.shortenedUrls.set(shortCode, shortenedUrl);
      this.clickLogs.set(shortCode, []);

      // Log the successful creation
      await Logger.info('frontend', 'api', `URL successfully shortened: ${shortCode}`);
      
      return { success: true, data: shortenedUrl };

    } catch (error) {
      await Logger.error('frontend', 'api', `URL shortening failed: ${error}`);
      return { success: false, error: 'Failed to shorten URL' };
    }
  }

  /**
   * Get all shortened URLs
   */
  async getAllShortenedUrls(): Promise<ShortenedUrl[]> {
    try {
      await Logger.info('frontend', 'api', 'Retrieving all shortened URLs');
      
      const urls = Array.from(this.shortenedUrls.values());
      await Logger.debug('frontend', 'api', `Retrieved ${urls.length} shortened URLs`);
      
      return urls;
    } catch (error) {
      await Logger.error('frontend', 'api', `Failed to retrieve URLs: ${error}`);
      return [];
    }
  }

  /**
   * Get URL by short code
   */
  async getUrlByShortCode(shortCode: string): Promise<ShortenedUrl | null> {
    try {
      await Logger.debug('frontend', 'api', `Looking up URL for short code: ${shortCode}`);
      
      const url = this.shortenedUrls.get(shortCode);
      if (!url) {
        await Logger.warn('frontend', 'api', `Short code not found: ${shortCode}`);
        return null;
      }

      // Check if expired
      if (new Date() > url.expiresAt) {
        await Logger.warn('frontend', 'api', `Short code expired: ${shortCode}`);
        this.shortenedUrls.delete(shortCode);
        return null;
      }

      return url;
    } catch (error) {
      await Logger.error('frontend', 'api', `Failed to get URL: ${error}`);
      return null;
    }
  }

  /**
   * Record a click on a short URL
   */
  async recordClick(shortCode: string, source: string = 'direct'): Promise<void> {
    try {
      const url = this.shortenedUrls.get(shortCode);
      if (!url) return;

      // Increment click count
      url.clickCount++;
      this.shortenedUrls.set(shortCode, url);

      // Create click log
      const clickLog: ClickLog = {
        id: Date.now().toString(),
        shortCode,
        timestamp: new Date(),
        source,
        geoLocation: {
          country: 'Unknown',
          city: 'Unknown',
          region: 'Unknown'
        },
        userAgent: navigator.userAgent,
        ipAddress: 'Unknown'
      };

      // Store click log
      const logs = this.clickLogs.get(shortCode) || [];
      logs.push(clickLog);
      this.clickLogs.set(shortCode, logs);

      // Update URL with click logs
      url.clickLogs = logs;
      this.shortenedUrls.set(shortCode, url);

      await Logger.info('frontend', 'api', `Click recorded for short code: ${shortCode}`);
    } catch (error) {
      await Logger.error('frontend', 'api', `Failed to record click: ${error}`);
    }
  }

  /**
   * Get click logs for a short code
   */
  async getClickLogs(shortCode: string): Promise<ClickLog[]> {
    try {
      const logs = this.clickLogs.get(shortCode) || [];
      await Logger.debug('frontend', 'api', `Retrieved ${logs.length} click logs for ${shortCode}`);
      return logs;
    } catch (error) {
      await Logger.error('frontend', 'api', `Failed to get click logs: ${error}`);
      return [];
    }
  }

  /**
   * Delete a shortened URL
   */
  async deleteUrl(shortCode: string): Promise<boolean> {
    try {
      const deleted = this.shortenedUrls.delete(shortCode);
      this.clickLogs.delete(shortCode);
      
      if (deleted) {
        await Logger.info('frontend', 'api', `URL deleted: ${shortCode}`);
      }
      
      return deleted;
    } catch (error) {
      await Logger.error('frontend', 'api', `Failed to delete URL: ${error}`);
      return false;
    }
  }
}

export const urlApiService = new UrlApiService();
