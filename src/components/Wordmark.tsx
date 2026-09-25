import { content } from '@/data/content';
import { assetUrl } from '@/lib/assets';

const { brand } = content;
const markUrl = assetUrl(brand.logoMarkPath);

/** Text wordmark matching the logo lettering: "Sara" in secondary, "Codes" in primary. */
export function Wordmark({ className = 'text-lg' }: { className?: string }) {
  return (
    <span className={`font-heading font-semibold tracking-tight ${className}`}>
      <span className="text-secondary">{brand.wordmark.first}</span>
      <span className="text-primary">{brand.wordmark.second}</span>
    </span>
  );
}

/** Square logo mark (32px). Decorative: the surrounding link carries the accessible name. */
export function LogoMark({ size = 32 }: { size?: number }) {
  if (!markUrl) return null;
  return <img src={markUrl} alt="" width={size} height={size} className="shrink-0" />;
}
