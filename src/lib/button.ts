type Variant = 'secondary' | 'primary' | 'outline' | 'outlinePrimary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium no-underline transition-colors duration-200 disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  // Filled accents always use on-accent text (dark in the dark theme) and tertiary on hover.
  secondary: 'bg-secondary text-on-accent hover:bg-tertiary hover:text-on-accent',
  primary: 'bg-primary text-on-accent hover:bg-tertiary hover:text-on-accent',
  outline: 'border border-border text-text hover:border-tertiary hover:text-tertiary',
  outlinePrimary:
    'border border-primary text-primary hover:border-tertiary hover:bg-tertiary/10 hover:text-tertiary',
  ghost: 'text-muted hover:bg-surface hover:text-tertiary',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function buttonClasses(variant: Variant = 'secondary', size: Size = 'md', extra = '') {
  return [base, variants[variant], sizes[size], extra].filter(Boolean).join(' ');
}

/** Round icon-only button. */
export const iconButtonClasses =
  'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-tertiary hover:text-tertiary';
