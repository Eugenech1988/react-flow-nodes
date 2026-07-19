import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@pipeline/ui/globals.css';
import './style.css';
import { QueryProvider, AppRoutes } from './providers';
import { ThemeProvider } from 'next-themes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Router>
          <AppRoutes/>
        </Router>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
