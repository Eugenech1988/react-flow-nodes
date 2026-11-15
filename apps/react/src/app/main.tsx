import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@pipeline/ui/globals.css';
import './style.css';
import { QueryProvider, AppRoutes, ThemeProvider } from '@/app/providers';
import { FatalErrorState } from '@/shared/ui';

const CSRF_ERROR_TITLE = 'Unable to connect to the server';
const CSRF_ERROR_FALLBACK =
  'Failed to initialize a secure session. Check your connection and try again.';

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error && error.message) return error.message;
  return CSRF_ERROR_FALLBACK;
};

const renderFatalError = (message: string): void => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  createRoot(rootElement).render(
    <StrictMode>
      <FatalErrorState title={CSRF_ERROR_TITLE} message={message} />
    </StrictMode>,
  );
};

const renderApp = (): void => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  createRoot(rootElement).render(
    <StrictMode>
      <QueryProvider>
        <ThemeProvider defaultTheme="system">
          <Router>
            <AppRoutes />
          </Router>
        </ThemeProvider>
      </QueryProvider>
    </StrictMode>,
  );
};

const bootstrap = async (): Promise<void> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/csrf-token`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
  } catch (error) {
    console.error('Failed to initialize CSRF token:', error);
    renderFatalError(getErrorMessage(error));
    return;
  }

  renderApp();
};

void bootstrap();