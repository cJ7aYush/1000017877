import { ShortenedUrl, UrlShortenRequest, UrlShortenResponse, ClickLog } from '../types';
import { Logger } from '../utils/logger';
import { urlApiService } from './urlApiService';

class UrlService {
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
   * Shorten a URL
   */
  async shortenUrl(request: UrlShortenRequest): Promise<UrlShortenResponse> {
    return await urlApiService.shortenUrl(request);
  }

  /**
   * Get all shortened URLs
   */
  async getAllShortenedUrls(): Promise<ShortenedUrl[]> {
    return await urlApiService.getAllShortenedUrls();
  }

  /**
   * Get URL by short code
   */
  async getUrlByShortCode(shortCode: string): Promise<ShortenedUrl | null> {
    return await urlApiService.getUrlByShortCode(shortCode);
  }

  /**
   * Record a click on a short URL
   */
  async recordClick(shortCode: string, source: string = 'direct'): Promise<void> {
    return await urlApiService.recordClick(shortCode, source);
  }

  /**
   * Get click logs for a short code
   */
  async getClickLogs(shortCode: string): Promise<ClickLog[]> {
    return await urlApiService.getClickLogs(shortCode);
  }

  /**
   * Delete a shortened URL
   */
  async deleteUrl(shortCode: string): Promise<boolean> {
    return await urlApiService.deleteUrl(shortCode);
  }
}

export const urlService = new UrlService();
