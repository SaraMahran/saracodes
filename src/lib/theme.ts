export type Theme = 'dark' | 'light';

/** Keep in sync with public/theme-init.js (runs before first paint). */
export const THEME_STORAGE_KEY = 'saracodes-theme';

const listeners = new Set<() => void>();

export function readStoredTheme(): Theme | null {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === 'light' || value === 'dark' ? value : null;
  } catch {
    return null;
  }
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked site data); the theme still applies.
  }
}

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark';
}

/** Keeps the browser UI color in step with the current --color-bg token. */
function syncThemeColorMeta() {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim();
  if (meta && bg) meta.content = `rgb(${bg})`;
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  storeTheme(theme);
  syncThemeColorMeta();
  listeners.forEach((listener) => listener());
}

export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
