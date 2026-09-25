import type { ReactNode } from 'react';

/** Small mono tag used for tech stacks. Glows tertiary on hover. */
export function Chip({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs text-muted transition-[color,border-color,box-shadow] duration-200 hover:border-tertiary hover:text-tertiary hover:shadow-[0_0_18px_-4px_rgb(var(--color-tertiary)/0.55)] ${className}`}
    >
      {children}
    </span>
  );
}

/** A wrapping list of chips. */
export function ChipList({
  items,
  className = '',
  label,
}: {
  items: string[];
  className?: string;
  /** Optional accessible name for the list, e.g. "Skills". */
  label?: string;
}) {
  return (
    <ul aria-label={label} className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Chip>{item}</Chip>
        </li>
      ))}
    </ul>
  );
}
