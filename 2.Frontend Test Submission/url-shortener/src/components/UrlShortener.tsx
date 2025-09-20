import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Divider
} from '@mui/material';
import {
  ContentCopy,
  Delete,
  Link as LinkIcon,
  Visibility
} from '@mui/icons-material';
import { ShortenedUrl, UrlShortenRequest, ValidationError } from '../types';
import { urlService } from '../services/urlService';
import { Logger } from '../utils/logger';

const UrlShortener: React.FC = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [validityMinutes, setValidityMinutes] = useState(30);
  const [customShortCode, setCustomShortCode] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    loadShortenedUrls();
  }, []);

  const loadShortenedUrls = async () => {
    try {
      const urls = await urlService.getAllShortenedUrls();
      setShortenedUrls(urls);
    } catch (error) {
      await Logger.error('frontend', 'component', 'Failed to load shortened URLs');
    }
  };

  const validateForm = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!originalUrl.trim()) {
      errors.push({ field: 'originalUrl', message: 'URL is required' });
    } else {
      try {
        new URL(originalUrl);
      } catch {
        errors.push({ field: 'originalUrl', message: 'Invalid URL format' });
      }
    }

    if (validityMinutes < 1 || validityMinutes > 1440) {
      errors.push({ field: 'validityMinutes', message: 'Validity must be between 1 and 1440 minutes' });
    }

    if (customShortCode && (customShortCode.length < 3 || customShortCode.length > 20)) {
      errors.push({ field: 'customShortCode', message: 'Custom short code must be 3-20 characters' });
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setValidationErrors([]);

    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      await Logger.warn('frontend', 'component', 'Form validation failed');
      return;
    }

    setLoading(true);

    try {
      const request: UrlShortenRequest = {
        originalUrl: originalUrl.trim(),
        validityMinutes,
        customShortCode: customShortCode.trim() || undefined
      };

      const response = await urlService.shortenUrl(request);

      if (response.success && response.data) {
        setSuccess('URL shortened successfully!');
        setOriginalUrl('');
        setCustomShortCode('');
        setValidityMinutes(30);
        await loadShortenedUrls();
        await Logger.info('frontend', 'component', 'URL successfully shortened by user');
      } else {
        setError(response.error || 'Failed to shorten URL');
        await Logger.error('frontend', 'component', `URL shortening failed: ${response.error}`);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      await Logger.error('frontend', 'component', `Unexpected error during URL shortening: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      await Logger.info('frontend', 'component', 'URL copied to clipboard');
    } catch (error) {
      await Logger.error('frontend', 'component', 'Failed to copy URL to clipboard');
    }
  };

  const handleDeleteUrl = async (shortCode: string) => {
    try {
      const deleted = await urlService.deleteUrl(shortCode);
      if (deleted) {
        await loadShortenedUrls();
        await Logger.info('frontend', 'component', `URL deleted: ${shortCode}`);
      }
    } catch (error) {
      await Logger.error('frontend', 'component', `Failed to delete URL: ${error}`);
    }
  };

  const handleViewDetails = (url: ShortenedUrl) => {
    setSelectedUrl(url);
    setDetailsOpen(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const isExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt);
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        URL Shortener
      </Typography>

      <Card sx={{ marginBottom: 3 }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Original URL"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                error={validationErrors.some(e => e.field === 'originalUrl')}
                helperText={validationErrors.find(e => e.field === 'originalUrl')?.message}
                placeholder="https://example.com"
              />
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  fullWidth
                  label="Validity Period (minutes)"
                  type="number"
                  value={validityMinutes}
                  onChange={(e) => setValidityMinutes(Number(e.target.value))}
                  error={validationErrors.some(e => e.field === 'validityMinutes')}
                  helperText={validationErrors.find(e => e.field === 'validityMinutes')?.message}
                  inputProps={{ min: 1, max: 1440 }}
                  sx={{ flex: '1 1 200px', minWidth: '150px' }}
                />
                
                <TextField
                  fullWidth
                  label="Custom Short Code (optional)"
                  value={customShortCode}
                  onChange={(e) => setCustomShortCode(e.target.value)}
                  error={validationErrors.some(e => e.field === 'customShortCode')}
                  helperText={validationErrors.find(e => e.field === 'customShortCode')?.message}
                  placeholder="mycode"
                  sx={{ flex: '1 1 200px', minWidth: '150px' }}
                />
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading || shortenedUrls.length >= 5}
                startIcon={<LinkIcon />}
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </Button>
              {shortenedUrls.length >= 5 && (
                <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
                  Maximum of 5 URLs allowed
                </Typography>
              )}
            </Box>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ marginBottom: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Shortened URLs ({shortenedUrls.length}/5)
          </Typography>
          
          {shortenedUrls.length === 0 ? (
            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
              No URLs shortened yet
            </Typography>
          ) : (
            <List>
              {shortenedUrls.map((url) => (
                <React.Fragment key={url.id}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                            {url.shortUrl}
                          </Typography>
                          {isExpired(url.expiresAt) && (
                            <Chip label="Expired" color="error" size="small" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {url.originalUrl}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Typography variant="caption">
                              Created: {formatDate(url.createdAt)}
                            </Typography>
                            <Typography variant="caption">
                              Expires: {formatDate(url.expiresAt)}
                            </Typography>
                            <Typography variant="caption">
                              Clicks: {url.clickCount}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => handleCopyUrl(url.shortUrl)}
                        title="Copy URL"
                      >
                        <ContentCopy />
                      </IconButton>
                      <IconButton
                        onClick={() => handleViewDetails(url)}
                        title="View Details"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteUrl(url.shortCode)}
                        title="Delete"
                        color="error"
                      >
                        <Delete />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>URL Details</DialogTitle>
        <DialogContent>
          {selectedUrl && (
            <Box>
              <Typography variant="h6" gutterBottom>Original URL</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
                {selectedUrl.originalUrl}
              </Typography>
              
              <Typography variant="h6" gutterBottom>Short URL</Typography>
              <Typography variant="body2" sx={{ wordBreak: 'break-all', mb: 2 }}>
                {selectedUrl.shortUrl}
              </Typography>
              
              <Typography variant="h6" gutterBottom>Statistics</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {selectedUrl.clickCount}
                    </Typography>
                    <Typography variant="caption">Total Clicks</Typography>
                  </Paper>
                </Box>
                <Box sx={{ flex: '1 1 200px', minWidth: '150px' }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h6">
                      {isExpired(selectedUrl.expiresAt) ? 'Expired' : 'Active'}
                    </Typography>
                    <Typography variant="caption">Status</Typography>
                  </Paper>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Click Logs ({selectedUrl.clickLogs.length})
              </Typography>
              {selectedUrl.clickLogs.length === 0 ? (
                <Typography color="text.secondary">No clicks yet</Typography>
              ) : (
                <List dense>
                  {selectedUrl.clickLogs.map((log) => (
                    <ListItem key={log.id}>
                      <ListItemText
                        primary={formatDate(log.timestamp)}
                        secondary={`Source: ${log.source} | Location: ${log.geoLocation.city}, ${log.geoLocation.country}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UrlShortener;
