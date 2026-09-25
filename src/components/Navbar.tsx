import { useState } from 'react';
import { motion } from 'framer-motion';
import { Command, Menu } from 'lucide-react';
import { commandPaletteText } from '@/data/commands';
import { content } from '@/data/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { buttonClasses, iconButtonClasses } from '@/lib/button';
import { isMacLike } from '@/lib/platform';
import { handleAnchorClick } from '@/lib/scroll';
import { navSections, sectionIds } from '@/lib/sections';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark, Wordmark } from './Wordmark';

const { ui } = content;
const MOBILE_MENU_ID = 'mobile-menu';

interface NavbarProps {
  onOpenPalette: () => void;
}

export function Navbar({ onOpenPalette }: NavbarProps) {
  const activeId = useActiveSection(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac] = useState(isMacLike);
  const shortcut = isMac
    ? commandPaletteText.shortcutHint.mac
    : commandPaletteText.shortcutHint.other;

  return (
    <header className="no-print sticky top-0 z-50 h-16 border-b border-border/60 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          onClick={(event) => handleAnchorClick(event, 'hero')}
          aria-label={ui.homeLinkLabel}
          className="flex items-center gap-2.5 rounded-md no-underline"
        >
          <LogoMark />
          <Wordmark />
        </a>

        <nav aria-label={ui.mainNavLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navSections.map((section) => {
              const isActive = activeId === section.id;
              return (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={(event) => handleAnchorClick(event, section.id)}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative block rounded-md px-3 py-2 text-sm font-medium no-underline transition-colors ${
                      isActive ? 'text-primary' : 'text-muted hover:text-tertiary'
                    }`}
                  >
                    {section.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        aria-hidden="true"
                        className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenPalette}
            aria-label={ui.openCommandPalette}
            aria-keyshortcuts="Control+K Meta+K"
            className="hidden h-9 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-xs text-muted transition-colors hover:border-tertiary hover:text-tertiary sm:inline-flex"
          >
            <Command size={14} aria-hidden />
            <kbd className="font-mono">{shortcut}</kbd>
          </button>
          <ThemeToggle />
          <a
            href="#contact"
            onClick={(event) => handleAnchorClick(event, 'contact')}
            className={buttonClasses('secondary', 'sm', 'hidden sm:inline-flex')}
          >
            {ui.hireMe}
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label={ui.openMenu}
            aria-expanded={menuOpen}
            aria-controls={MOBILE_MENU_ID}
            className={`${iconButtonClasses} lg:hidden`}
          >
            <Menu size={18} aria-hidden />
          </button>
        </div>
      </div>

      <MobileMenu
        id={MOBILE_MENU_ID}
        open={menuOpen}
        activeId={activeId}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
