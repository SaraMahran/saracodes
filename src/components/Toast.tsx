import { useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { content } from '@/data/content';
import {
  dismissToast,
  getToasts,
  holdToasts,
  releaseToasts,
  subscribeToasts,
  type ToastKind,
} from '@/lib/toast';

const { ui } = content;

const icons: Record<ToastKind, typeof Info> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

// Accent per kind, from the existing tokens only.
const accents: Record<ToastKind, string> = {
  success: 'text-primary',
  error: 'text-secondary',
  info: 'text-tertiary',
};

const noToasts: ReturnType<typeof getToasts> = [];

/**
 * Renders toasts raised with showToast(). Mount once near the app root. Polite live region;
 * auto-dismiss pauses while hovered or focused, and each toast can be dismissed manually.
 */
export function Toaster() {
  const toasts = useSyncExternalStore(subscribeToasts, getToasts, () => noToasts);

  return (
    <section
      aria-label={ui.notificationsLabel}
      className="no-print pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      onMouseEnter={holdToasts}
      onMouseLeave={releaseToasts}
      onFocus={holdToasts}
      onBlur={releaseToasts}
    >
      {/* The live region wraps the list so the list keeps its own semantics. */}
      <div role="status" aria-live="polite" className="flex w-full max-w-sm flex-col">
        <ol className="flex w-full flex-col gap-2">
          <AnimatePresence initial={false}>
            {toasts.map((toast) => {
              const Icon = icons[toast.kind];
              return (
                <motion.li
                  key={toast.id}
                  layout
                  initial={{ opacity: 0, y: 16, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-auto flex items-start gap-3 rounded-2xl border border-border bg-surface p-4 shadow-glow"
                >
                  <Icon
                    size={18}
                    aria-hidden
                    className={`mt-0.5 shrink-0 ${accents[toast.kind]}`}
                  />
                  <div className="min-w-0 flex-1 text-sm">
                    {toast.title && <p className="font-semibold text-text">{toast.title}</p>}
                    <p className="break-words text-muted">{toast.message}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => dismissToast(toast.id)}
                    aria-label={ui.dismissNotification}
                    className="-m-1 rounded-full p-1 text-muted transition-colors hover:text-tertiary"
                  >
                    <X size={14} aria-hidden />
                  </button>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ol>
      </div>
    </section>
  );
}
