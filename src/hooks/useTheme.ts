import { useSyncExternalStore } from 'react';
import { getTheme, setTheme, subscribeTheme, toggleTheme, type Theme } from '@/lib/theme';

const getServerTheme = (): Theme => 'dark';

/**
 * Current theme plus setters, shared by every component through one store. The initial theme is
 * applied before first paint by public/theme-init.js: a saved value first, then
 * prefers-color-scheme on a first visit, otherwise dark.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);
  return { theme, setTheme, toggleTheme };
}
