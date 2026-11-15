import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import '@pipeline/ui/globals.css';
import './style.css';
import { QueryProvider, AppRoutes, ThemeProvider } from '@/app/providers';

const CSRF_ERROR_TITLE = 'Unable to connect to the server';
const CSRF_ERROR_FALLBACK =
  'Failed to initialize secure session. Check your connection and try again.';

const renderFatalError = (message: string): void => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  createRoot(rootElement).render(
    <StrictMode>
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-8 text-center">
        <h1 className="text-xl font-semibold">{CSRF_ERROR_TITLE}</h1>
        <p className="text-muted-foreground max-w-md text-sm">{message}</p>
        <button
          type="button"
          className="bg-primary text-primary-foreground mt-2 cursor-pointer rounded-xl px-4 py-2 text-sm font-medium"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
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
    const message = error instanceof Error && error.message ? error.message : CSRF_ERROR_FALLBACK;
    renderFatalError(message);
    return;
  }

  renderApp();
};

void bootstrap();