import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Preserve incoming links from the previously deployed hash router.
if (window.location.hash.startsWith('#/')) {
  const legacy = window.location.hash.slice(1);
  const target = legacy.replace(/^\/pricing(?=$|[?#])/, '/business-health-review');
  window.history.replaceState(null, '', target);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
