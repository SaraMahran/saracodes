import { useEffect } from 'react';

/**
 * Loads code-split chunks once the page is idle, so dialogs open instantly without adding to
 * the initial bundle. Falls back to a timeout where requestIdleCallback is unavailable.
 */
export function usePrefetchOnIdle(...loaders: (() => Promise<unknown>)[]) {
  useEffect(() => {
    const run = () => loaders.forEach((load) => void load().catch(() => undefined));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 5000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = setTimeout(run, 3000);
    return () => clearTimeout(timer);
    // Loaders are module-level constants; run once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
