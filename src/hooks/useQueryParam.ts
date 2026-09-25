import { useCallback, useEffect, useState } from 'react';

function readParam(key: string, isValid: (value: string) => boolean, fallback: string) {
  try {
    const value = new URLSearchParams(window.location.search).get(key);
    return value && isValid(value) ? value : fallback;
  } catch {
    return fallback;
  }
}

/**
 * State mirrored to a URL query parameter (e.g. ?filter=react) so it can be shared.
 * Uses replaceState to avoid filling history; the fallback value removes the parameter.
 * Invalid values in the URL fall back to `fallback`.
 */
export function useQueryParam(key: string, isValid: (value: string) => boolean, fallback: string) {
  const [value, setValue] = useState(() => readParam(key, isValid, fallback));

  useEffect(() => {
    const onPopState = () => setValue(readParam(key, isValid, fallback));
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [key, isValid, fallback]);

  const update = useCallback(
    (next: string) => {
      setValue(next);
      const url = new URL(window.location.href);
      if (next === fallback) url.searchParams.delete(key);
      else url.searchParams.set(key, next);
      window.history.replaceState(window.history.state, '', url);
    },
    [key, fallback],
  );

  return [value, update] as const;
}
