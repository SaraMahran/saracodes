import { useRef, type MouseEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { content } from '@/data/content';
import type { SectionId } from '@/data/types';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { buttonClasses, iconButtonClasses } from '@/lib/button';
import { scrollToId } from '@/lib/scroll';
import { navSections } from '@/lib/sections';
import { ThemeToggle } from './ThemeToggle';
import { Wordmark } from './Wordmark';

const { brand, ui } = content;

interface MobileMenuProps {
  id: string;
  open: boolean;
  activeId: string | null;
  onClose: () => void;
}

/**
 * Full-screen mobile navigation. Traps focus, closes on Escape, and returns focus to the menu
 * button. Link targets are scrolled to after the exit animation so focus lands on the section.
 */
export function MobileMenu({ id, open, activeId, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingTarget = useRef<SectionId | null>(null);
  useFocusTrap(panelRef, open, onClose);

  const navigate = (event: MouseEvent<HTMLAnchorElement>, target: SectionId) => {
    event.preventDefault();
    pendingTarget.current = target;
    onClose();
  };

  const onExitComplete = () => {
    if (pendingTarget.current) scrollToId(pendingTarget.current);
    pendingTarget.current = null;
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          id={id}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ui.mobileNavLabel}
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg/95 backdrop-blur-lg lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-4 sm:px-6">
            <Wordmark />
            <button
              type="button"
              onClick={onClose}
              aria-label={ui.closeMenu}
              data-autofocus
              className={iconButtonClasses}
            >
              <X size={18} aria-hidden />
            </button>
          </div>

          <nav aria-label={ui.mobileNavLabel} className="flex-1 px-4 py-8 sm:px-6">
            <motion.ul
              className="flex flex-col gap-1"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {navSections.map((section) => {
                const isActive = activeId === section.id;
                return (
                  <motion.li
                    key={section.id}
                    variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
                  >
                    <a
                      href={`#${section.id}`}
                      onClick={(event) => navigate(event, section.id)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`block rounded-lg py-3 font-heading text-3xl font-semibold no-underline transition-colors ${
                        isActive ? 'text-primary' : 'text-text hover:text-tertiary'
                      }`}
                    >
                      {section.label}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 px-4 py-6 sm:px-6">
            <a
              href="#contact"
              onClick={(event) => navigate(event, 'contact')}
              className={buttonClasses('secondary', 'lg')}
            >
              {ui.hireMe}
            </a>
            <a href={brand.cvPath} download className={buttonClasses('outline', 'lg')}>
              <Download size={18} aria-hidden />
              {ui.downloadCv}
            </a>
            <ThemeToggle className="ml-auto h-12 w-12" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
