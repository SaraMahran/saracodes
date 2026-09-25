import type { Todo } from '@/data/types';

/** True for placeholder content that should never be shown to visitors. */
export const isTodo = (value: unknown): value is Todo =>
  typeof value === 'string' && value.trimStart().startsWith('TODO');

/** True when a value is present and is not a TODO placeholder. */
export const isFilled = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim() !== '' && !isTodo(value);

/**
 * Removes inline TODO notes from otherwise real text, e.g.
 * "Volunteering with PwA (TODO: full organization name)." -> "Volunteering with PwA."
 * Returns an empty string when the whole value is a TODO placeholder.
 */
export function withoutTodo(text: string): string {
  if (isTodo(text)) return '';
  return text
    .replace(/\s*\(\s*TODO:[^)]*\)/g, '')
    .replace(/\s*\bTODO:.*$/, '')
    .replace(/\s+([.,;:!?])/g, '$1')
    .trim();
}
