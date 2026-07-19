import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@pipeline/ui/globals.css';
import './style.css';
import { ThemeProvider, QueryProvider, AppRoutes } from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="pipeline-studio-theme">
        <Router>
          <AppRoutes/>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
