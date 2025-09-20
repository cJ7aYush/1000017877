import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  ContentCopy,
  Delete,
  Refresh,
  Link as LinkIcon,
  TrendingUp
} from '@mui/icons-material';
import { ShortenedUrl } from '../types';
import { urlService } from '../services/urlService';
import { Logger } from '../utils/logger';

const Statistics: React.FC = () => {
  const [shortenedUrls, setShortenedUrls] = useState<ShortenedUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      await Logger.info('frontend', 'page', 'Loading URL statistics');
      
      const urls = await urlService.getAllShortenedUrls();
      setShortenedUrls(urls);
      
      await Logger.info('frontend', 'page', `Loaded statistics for ${urls.length} URLs`);
    } catch (error) {
      setError('Failed to load statistics');
      await Logger.error('frontend', 'page', `Failed to load statistics: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (url: ShortenedUrl) => {
    setSelectedUrl(url);
    setDetailsOpen(true);
    Logger.info('frontend', 'component', `Viewing details for URL: ${url.shortCode}`);
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
        await loadStatistics();
        await Logger.info('frontend', 'component', `URL deleted: ${shortCode}`);
      }
    } catch (error) {
      await Logger.error('frontend', 'component', `Failed to delete URL: ${error}`);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  const isExpired = (expiresAt: Date) => {
    return new Date() > new Date(expiresAt);
  };

  const getTotalClicks = () => {
    return shortenedUrls.reduce((total, url) => total + url.clickCount, 0);
  };

  const getActiveUrls = () => {
    return shortenedUrls.filter(url => !isExpired(url.expiresAt)).length;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          URL Statistics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={loadStatistics}
        >
          Refresh
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ marginBottom: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {shortenedUrls.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {getActiveUrls()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active URLs
              </Typography>
            </CardContent>
          </Card>
        </Box>
        <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {getTotalClicks()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* URLs Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Shortened URLs
          </Typography>
          
          {shortenedUrls.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <LinkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No URLs found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Start by shortening some URLs to see statistics here
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Short URL</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shortenedUrls.map((url) => (
                    <TableRow key={url.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {url.shortUrl}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleCopyUrl(url.shortUrl)}
                            title="Copy URL"
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                          title={url.originalUrl}
                        >
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(url.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(url.expiresAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={isExpired(url.expiresAt) ? 'Expired' : 'Active'}
                          color={isExpired(url.expiresAt) ? 'error' : 'success'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <TrendingUp fontSize="small" color="action" />
                          <Typography variant="body2">
                            {url.clickCount}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(url)}
                          title="View Details"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUrl(url.shortCode)}
                          title="Delete"
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>URL Details & Click Logs</DialogTitle>
        <DialogContent>
          {selectedUrl && (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
                <Box>
                  <Typography variant="h6" gutterBottom>Original URL</Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      wordBreak: 'break-all',
                      backgroundColor: 'grey.100',
                      padding: 1,
                      borderRadius: 1
                    }}
                  >
                    {selectedUrl.originalUrl}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
                    <Typography variant="h6" gutterBottom>Short URL</Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        wordBreak: 'break-all',
                        backgroundColor: 'grey.100',
                        padding: 1,
                        borderRadius: 1
                      }}
                    >
                      {selectedUrl.shortUrl}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 300px', minWidth: '200px' }}>
                    <Typography variant="h6" gutterBottom>Statistics</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {selectedUrl.clickCount}
                        </Typography>
                        <Typography variant="caption">Total Clicks</Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6">
                          {isExpired(selectedUrl.expiresAt) ? 'Expired' : 'Active'}
                        </Typography>
                        <Typography variant="caption">Status</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Typography variant="h6" gutterBottom>
                Click Logs ({selectedUrl.clickLogs.length})
              </Typography>
              
              {selectedUrl.clickLogs.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    No clicks recorded yet
                  </Typography>
                </Box>
              ) : (
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Timestamp</TableCell>
                        <TableCell>Source</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>User Agent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedUrl.clickLogs
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Typography variant="body2">
                              {formatDate(log.timestamp)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={log.source} size="small" />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {log.geoLocation.city}, {log.geoLocation.country}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                maxWidth: 200,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                              title={log.userAgent}
                            >
                              {log.userAgent}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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

export default Statistics;
