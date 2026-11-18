import { createRoot, hydrateRoot } from 'react-dom/client';
import type { ErrorInfo } from 'react';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const rootElement = document.getElementById('root')!;
// Keeps caught errors off reportError(), which would raise the dev overlay.
const onCaughtError = (error: unknown, errorInfo: ErrorInfo) => {
  console.error(error, errorInfo.componentStack);
};
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, app, { onCaughtError });
} else {
  createRoot(rootElement, { onCaughtError }).render(app);
}
