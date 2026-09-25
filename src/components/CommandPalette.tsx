import { useEffect, useRef, useState } from 'react';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { commandGroups, commandPaletteText, commands, type CommandAction } from '@/data/commands';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { scrollToId } from '@/lib/scroll';
import { toggleTheme } from '@/lib/theme';
import { Icon } from './Icon';

const groups = Object.values(commandGroups).map((group) => ({
  heading: group,
  items: commands.filter((command) => command.group === group),
}));

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** Ctrl K / Cmd K command palette built on cmdk. Commands come from src/data/commands.ts. */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pendingScroll = useRef<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const close = () => onOpenChange(false);
  useFocusTrap(panelRef, open, close);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const run = (action: CommandAction) => {
    switch (action.type) {
      case 'navigate':
        // Scroll after the palette closes so focus can move to the target section.
        pendingScroll.current = action.anchorId ?? action.sectionId;
        break;
      case 'open':
        window.open(action.href, '_blank', 'noopener,noreferrer');
        break;
      case 'copy':
        navigator.clipboard
          ?.writeText(action.value)
          .then(() => setToast(action.successMessage))
          .catch(() => setToast(action.value));
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
    }
    close();
  };

  const onExitComplete = () => {
    const target = pendingScroll.current;
    pendingScroll.current = null;
    if (!target) return;
    // Project cards may not exist yet; fall back to the projects section.
    scrollToId(document.getElementById(target) ? target : 'projects');
  };

  return (
    <>
      <AnimatePresence onExitComplete={onExitComplete}>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex items-start justify-center bg-bg/70 px-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) close();
            }}
          >
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={commandPaletteText.label}
              className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-glow"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Command label={commandPaletteText.label} loop>
                <div className="flex items-center gap-3 border-b border-border px-4">
                  <Search size={16} aria-hidden className="shrink-0 text-muted" />
                  <Command.Input
                    data-autofocus
                    placeholder={commandPaletteText.placeholder}
                    className="h-14 w-full bg-transparent font-mono text-sm text-text outline-none placeholder:text-muted focus-visible:outline-none"
                  />
                  <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted">
                    {commandPaletteText.closeHint}
                  </kbd>
                </div>
                <Command.List className="max-h-[60vh] overflow-y-auto p-2">
                  <Command.Empty className="px-3 py-8 text-center font-mono text-sm text-muted">
                    {commandPaletteText.empty}
                  </Command.Empty>
                  {groups.map((group) => (
                    <Command.Group
                      key={group.heading}
                      heading={group.heading}
                      className="[&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-muted"
                    >
                      {group.items.map((command) => (
                        <Command.Item
                          key={command.id}
                          value={`${command.label} ${command.id}`}
                          keywords={command.keywords}
                          onSelect={() => run(command.action)}
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-text data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                        >
                          <Icon name={command.icon} size={16} className="shrink-0" />
                          <span className="truncate">{command.label}</span>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[90] flex justify-center px-4"
      >
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="rounded-full border border-border bg-surface px-4 py-2 font-mono text-sm text-text shadow-glow"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
