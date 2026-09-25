import type { Todo } from '@/data/types';

/** True for placeholder content that should never be shown to visitors. */
export const isTodo = (value: unknown): value is Todo =>
  typeof value === 'string' && value.trimStart().startsWith('TODO');

/** True when a value is present and is not a TODO placeholder. */
export const isFilled = (value: string | undefined | null): value is string =>
  typeof value === 'string' && value.trim() !== '' && !isTodo(value);
