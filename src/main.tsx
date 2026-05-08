import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ErrorBoundary } from './ErrorBoundary';

function renderFatalError(err: unknown) {
  const root = document.getElementById('root');
  if (!root) return;
  const message =
    err instanceof Error ? (err.stack || err.message) : typeof err === 'string' ? err : JSON.stringify(err);
  root.innerHTML = `<div style="min-height:100vh;padding:24px;font-family:system-ui,sans-serif;background:#030014;color:#e2e8f0">
    <h1 style="font-size:18px;font-weight:700;margin-bottom:12px;color:#fff">Fatal error</h1>
    <pre style="white-space:pre-wrap;background:rgba(255,255,255,0.08);padding:12px;border-radius:8px;overflow:auto;color:#e2e8f0">${message}</pre>
  </div>`;
}

window.addEventListener('error', (e) => renderFatalError(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => renderFatalError((e as PromiseRejectionEvent).reason));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
