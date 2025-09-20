import { Log, Logger } from './logger';

// Mock axios
jest.mock('axios');
import axios from 'axios';
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send log to evaluation server', async () => {
    const mockResponse = {
      data: { success: true, message: 'Log sent successfully' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const result = await Log('frontend', 'info', 'component', 'Test message');

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack: 'frontend',
        level: 'info',
        package: 'component',
        message: 'Test message'
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    );

    expect(result.success).toBe(true);
  });

  it('should handle network errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    const result = await Log('frontend', 'error', 'api', 'Test error');

    expect(result.success).toBe(false);
    expect(result.message).toBe('Network error');
  });

  it('should provide convenience methods', async () => {
    const mockResponse = {
      data: { success: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {}
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    await Logger.debug('frontend', 'component', 'Debug message');
    await Logger.info('frontend', 'api', 'Info message');
    await Logger.warn('frontend', 'hook', 'Warning message');
    await Logger.error('frontend', 'page', 'Error message');
    await Logger.fatal('backend', 'db', 'Fatal message');

    expect(mockedAxios.post).toHaveBeenCalledTimes(5);
  });
});
