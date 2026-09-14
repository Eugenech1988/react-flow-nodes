import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@pipeline/ui/globals.css';
import './style.css';
import { QueryProvider, AppRoutes } from '@/app/providers';
import { ThemeProvider } from 'next-themes';

async function bootstrap() {
  try {
    await fetch(`${import.meta.env.VITE_API_URL}/csrf-token`, {
      credentials: 'include',
    });
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>
  );
}

bootstrap();