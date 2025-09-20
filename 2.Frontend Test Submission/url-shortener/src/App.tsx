import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, AppBar, Toolbar, Typography, Container, Tabs, Tab, Box } from '@mui/material';
import { Link as LinkIcon, BarChart } from '@mui/icons-material';
import { useState } from 'react';
import UrlShortener from './components/UrlShortener';
import Statistics from './components/Statistics';
import RedirectHandler from './components/RedirectHandler';
import { Logger } from './utils/logger';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    Logger.info('frontend', 'page', `Switched to tab ${newValue === 0 ? 'URL Shortener' : 'Statistics'}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <LinkIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                URL Shortener
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg">
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="navigation tabs">
                <Tab 
                  icon={<LinkIcon />} 
                  label="URL Shortener" 
                  id="tab-0"
                  aria-controls="tabpanel-0"
                />
                <Tab 
                  icon={<BarChart />} 
                  label="Statistics" 
                  id="tab-1"
                  aria-controls="tabpanel-1"
                />
              </Tabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <UrlShortener />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <Statistics />
            </TabPanel>
          </Container>
        </Box>

        <Routes>
          <Route path="/" element={<Navigate to="/shortener" replace />} />
          <Route path="/shortener" element={<div />} />
          <Route path="/statistics" element={<div />} />
          <Route path="/:shortCode" element={<RedirectHandler />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
