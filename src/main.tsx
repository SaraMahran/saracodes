import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MotionConfig } from 'framer-motion';
// Self-hosted fonts (only the weights the design uses). The build preloads the critical ones.
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import App from './App';
import { NotFound } from './pages/NotFound';
import './styles/globals.css';

// The site is a single page; any other path (served via 404.html or an SPA rewrite) is a 404.
const isHome = ['/', '/index.html'].includes(window.location.pathname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* reducedMotion="user" makes every Framer Motion animation honor prefers-reduced-motion */}
    <MotionConfig reducedMotion="user">{isHome ? <App /> : <NotFound />}</MotionConfig>
  </StrictMode>,
);
