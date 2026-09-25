import { Lock } from 'lucide-react';
import { content } from '@/data/content';

export function ConfidentialBadge({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-tertiary/40 bg-tertiary/10 px-2.5 py-1 font-mono text-xs text-tertiary ${className}`}
    >
      <Lock size={12} aria-hidden />
      {content.ui.confidentialBadge}
    </span>
  );
}
