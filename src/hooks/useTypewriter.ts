import { useEffect, useState } from 'react';

interface TypewriterOptions {
  enabled?: boolean;
  typeMs?: number;
  deleteMs?: number;
  /** Pause with the full word shown. */
  holdMs?: number;
  /** Pause with nothing shown before the next word. */
  gapMs?: number;
}

/**
 * Types and deletes each word in turn, looping forever. When disabled (e.g. reduced motion)
 * it returns the first word, fully typed and static.
 */
export function useTypewriter(
  words: readonly string[],
  {
    enabled = true,
    typeMs = 70,
    deleteMs = 35,
    holdMs = 1800,
    gapMs = 400,
  }: TypewriterOptions = {},
) {
  const [state, setState] = useState({ index: 0, length: 0, deleting: false });

  useEffect(() => {
    if (!enabled || words.length === 0) return;
    const word = words[state.index % words.length];

    let delay: number;
    let next: typeof state;
    if (!state.deleting && state.length < word.length) {
      delay = typeMs;
      next = { ...state, length: state.length + 1 };
    } else if (!state.deleting) {
      delay = holdMs;
      next = { ...state, deleting: true };
    } else if (state.length > 0) {
      delay = deleteMs;
      next = { ...state, length: state.length - 1 };
    } else {
      delay = gapMs;
      next = { index: (state.index + 1) % words.length, length: 0, deleting: false };
    }

    const timer = window.setTimeout(() => setState(next), delay);
    return () => window.clearTimeout(timer);
  }, [state, enabled, words, typeMs, deleteMs, holdMs, gapMs]);

  if (!enabled) return words[0] ?? '';
  return (words[state.index % words.length] ?? '').slice(0, state.length);
}
