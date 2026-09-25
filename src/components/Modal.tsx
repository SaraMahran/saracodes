import { useEffect, useRef, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { content } from '@/data/content';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { iconButtonClasses } from '@/lib/button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the element that names the dialog (usually its heading). */
  labelledBy: string;
  /** Runs after the close animation, e.g. to scroll once focus has been restored. */
  onExitComplete?: () => void;
  size?: 'md' | 'lg';
  /** When this changes (e.g. next/previous item), the panel scrolls back to the top. */
  scrollKey?: string;
  children: ReactNode;
}

const sizes = { md: 'max-w-lg', lg: 'max-w-3xl' };

/**
 * Accessible modal dialog: traps focus, closes on Escape or backdrop click, locks page scroll
 * and restores focus to the element that opened it.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  onExitComplete,
  size = 'md',
  scrollKey,
  children,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);

  useEffect(() => {
    panelRef.current?.scrollTo({ top: 0 });
  }, [scrollKey]);

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-bg/70 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={`relative max-h-[90svh] w-full ${sizes[size]} overflow-y-auto rounded-t-3xl border border-border bg-surface p-6 shadow-glow sm:rounded-3xl sm:p-8`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={content.ui.closeDialog}
              className={`${iconButtonClasses} absolute right-4 top-4 z-10 bg-surface/80 backdrop-blur`}
            >
              <X size={16} aria-hidden />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
