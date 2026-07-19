import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@pipeline/ui/globals.css';
import './style.css';
import { ThemeProvider, QueryProvider } from './providers';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider defaultTheme="system" storageKey="pipeline-studio-theme">
        <App/>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>
);
