import { useEffect, useState } from 'react';

interface TypedCountOptions {
  /** Start typing (e.g. once the element is in view). */
  start: boolean;
  /** When false, returns `total` immediately (reduced motion). */
  enabled?: boolean;
  charsPerTick?: number;
  tickMs?: number;
}

/** Counts from 0 to `total` once, for a type-it-out effect. */
export function useTypedCount(
  total: number,
  { start, enabled = true, charsPerTick = 2, tickMs = 30 }: TypedCountOptions,
) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!enabled || !start || count >= total) return;
    const timer = window.setTimeout(
      () => setCount((value) => Math.min(total, value + charsPerTick)),
      tickMs,
    );
    return () => window.clearTimeout(timer);
  }, [enabled, start, count, total, charsPerTick, tickMs]);

  return enabled ? count : total;
}
