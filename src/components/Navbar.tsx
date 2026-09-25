import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import { content } from '@/data/content';
import { useActiveSection } from '@/hooks/useActiveSection';
import { buttonClasses, iconButtonClasses } from '@/lib/button';
import { handleAnchorClick } from '@/lib/scroll';
import { navSections, sectionIds } from '@/lib/sections';
import { MobileMenu } from './MobileMenu';
import { ThemeToggle } from './ThemeToggle';
import { LogoMark, Wordmark } from './Wordmark';

const { ui } = content;
const MOBILE_MENU_ID = 'mobile-menu';

// The command palette opens with Ctrl K / Cmd K (handled in App); the footer shows a tip.
export function Navbar() {
  const activeId = useActiveSection(sectionIds);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 h-16 border-b border-border/60 bg-surface/70 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          onClick={(event) => handleAnchorClick(event, 'hero')}
          aria-label={ui.homeLinkLabel}
          className="flex items-center gap-2.5 rounded-md no-underline"
        >
          <LogoMark alt={ui.logoMarkAlt} />
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
