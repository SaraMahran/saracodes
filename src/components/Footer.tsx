import { useState } from 'react';
import { ArrowUp, Mail } from 'lucide-react';
import { content } from '@/data/content';
import { logo, logoHeightFor } from '@/lib/brandAssets';
import { buttonClasses } from '@/lib/button';
import { isMacLike } from '@/lib/platform';
import { scrollToId } from '@/lib/scroll';
import { SocialLinks } from './SocialLinks';

const { brand, ui } = content;
const FOOTER_LOGO_WIDTH = 144;

/**
 * "Tip: press Ctrl K to navigate quickly", with ⌘ K on macOS / iOS (one symbol, never both).
 * Hidden on touch-only devices, where there is no keyboard shortcut to press, and in print.
 */
function PaletteTip() {
  const [isMac] = useState(isMacLike);
  const [before, after = ''] = ui.paletteTip.split('{shortcut}');
  const shortcut = isMac ? ui.paletteShortcut.mac : ui.paletteShortcut.other;

  return (
    <p data-palette-tip className="no-print [@media(pointer:coarse)]:hidden">
      {before}
      <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[11px] text-text">
        {shortcut}
      </kbd>
      {after}
    </p>
  );
}

export function Footer() {
  const copyright = ui.copyright.replace('{year}', String(new Date().getFullYear()));

  return (
    <footer className="border-t border-border/60 bg-surface/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="flex max-w-sm flex-col gap-4">
          <img
            src={logo.src}
            alt={brand.logoAlt}
            width={FOOTER_LOGO_WIDTH}
            height={logoHeightFor(FOOTER_LOGO_WIDTH)}
            loading="lazy"
            decoding="async"
            className="block h-auto self-start"
            style={{ width: FOOTER_LOGO_WIDTH }}
          />
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
            className={buttonClasses('outline', 'sm', 'no-print')}
          >
            <ArrowUp size={16} aria-hidden />
            {ui.backToTop}
          </button>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>{copyright}</p>
          <PaletteTip />
        </div>
      </div>
    </footer>
  );
}
