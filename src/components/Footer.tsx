import { ArrowUp, Mail } from 'lucide-react';
import { content } from '@/data/content';
import { assetUrl } from '@/lib/assets';
import { buttonClasses } from '@/lib/button';
import { scrollToId } from '@/lib/scroll';
import { SocialLinks } from './SocialLinks';
import { Wordmark } from './Wordmark';

const { brand, ui } = content;
const logoUrl = assetUrl(brand.logoPath);

export function Footer() {
  const copyright = ui.copyright.replace('{year}', String(new Date().getFullYear()));

  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex max-w-sm flex-col gap-4">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={brand.logoAlt}
              width={96}
              height={96}
              className="h-20 w-auto self-start"
            />
          ) : (
            <Wordmark className="text-2xl" />
          )}
          <p className="text-sm text-muted">{brand.tagline}</p>
          <a
            href={`mailto:${brand.email}`}
            className="inline-flex items-center gap-2 self-start text-sm"
          >
            <Mail size={16} aria-hidden />
            <span className="sr-only">{ui.emailLabel}: </span>
            {brand.email}
          </a>
        </div>

        <div className="flex flex-col items-start gap-4 md:items-end">
          <SocialLinks />
          <button
            type="button"
            onClick={() => scrollToId('hero')}
            className={buttonClasses('outline', 'sm')}
          >
            <ArrowUp size={16} aria-hidden />
            {ui.backToTop}
          </button>
        </div>
      </div>

      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6 lg:px-8">
          {copyright}
        </p>
      </div>
    </footer>
  );
}
