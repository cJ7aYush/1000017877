import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { urlService } from '../services/urlService';
import { Logger } from '../utils/logger';

const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleRedirect();
  }, [shortCode]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRedirect = async () => {
    if (!shortCode) {
      setError('Invalid short code');
      setLoading(false);
      return;
    }

    try {
      await Logger.info('frontend', 'page', `Redirect attempt for short code: ${shortCode}`);
      
      const url = await urlService.getUrlByShortCode(shortCode);
      
      if (!url) {
        setError('Short URL not found or has expired');
        await Logger.warn('frontend', 'page', `Short code not found: ${shortCode}`);
        setLoading(false);
        return;
      }

      // Record the click
      await urlService.recordClick(shortCode, 'direct');
      
      // Redirect to the original URL
      await Logger.info('frontend', 'page', `Redirecting to: ${url.originalUrl}`);
      window.location.href = url.originalUrl;
      
    } catch (error) {
      setError('An error occurred while processing the redirect');
      await Logger.error('frontend', 'page', `Redirect error: ${error}`);
      setLoading(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6">Redirecting...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          gap: 2,
          padding: 2
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 400, width: '100%' }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={handleGoHome}>
          Go to Home
        </Button>
      </Box>
    );
  }

  return null;
};

export default RedirectHandler;
