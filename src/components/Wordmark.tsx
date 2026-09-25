import { content } from '@/data/content';
import { logoMark } from '@/lib/brandAssets';

const { brand } = content;

/** Text wordmark matching the logo lettering: "Sara" in secondary, "Codes" in primary. */
export function Wordmark({ className = 'text-lg' }: { className?: string }) {
  return (
    <span className={`font-heading font-semibold tracking-tight ${className}`}>
      <span className="text-secondary">{brand.wordmark.first}</span>
      <span className="text-primary">{brand.wordmark.second}</span>
    </span>
  );
}

interface LogoMarkProps {
  size?: number;
  loading?: 'eager' | 'lazy';
  className?: string;
}

/**
 * Square logo mark. Decorative (alt=""): wherever it appears, the surrounding link or text
 * carries the accessible name. Explicit width/height prevent layout shift.
 */
export function LogoMark({ size = 32, loading = 'eager', className = '' }: LogoMarkProps) {
  return (
    <img
      src={logoMark.src}
      alt=""
      width={size}
      height={size}
      loading={loading}
      decoding="async"
      className={`block shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
