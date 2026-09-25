import { useEffect, useRef } from 'react';
import { Command } from 'cmdk';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { commandGroups, commandPaletteText, commands, type CommandAction } from '@/data/commands';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { copyEmail } from '@/lib/clipboard';
import { downloadFile } from '@/lib/download';
import { requestOpenProject } from '@/lib/projectEvents';
import { scrollToId } from '@/lib/scroll';
import { toggleTheme } from '@/lib/theme';
import { Icon } from './Icon';

const groups = Object.values(commandGroups).map((group) => ({
  heading: group,
  items: commands.filter((command) => command.group === group),
}));

const kbdClasses =
  'inline-flex min-w-[1.5rem] items-center justify-center rounded border border-border bg-bg px-1.5 py-0.5 font-mono text-[11px] text-muted';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Ctrl K / Cmd K command palette built on cmdk (fuzzy search, arrow keys, Enter). Commands come
 * from src/data/commands.ts. Traps focus, closes on Escape, backdrop click or selection, and
 * returns focus to where it was opened from.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  // Actions that move focus elsewhere run after the palette has closed and restored focus.
  const pending = useRef<CommandAction | null>(null);

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

  const run = (action: CommandAction) => {
    switch (action.type) {
      case 'navigate':
      case 'open-project':
        pending.current = action;
        break;
      case 'open':
        // Must run inside the user gesture or popup blockers step in.
        window.open(action.href, '_blank', 'noopener,noreferrer');
        break;
      case 'download':
        downloadFile(action.href);
        break;
      case 'copy-email':
        void copyEmail();
        break;
      case 'toggle-theme':
        toggleTheme();
        break;
    }
    close();
  };

  const onExitComplete = () => {
    const action = pending.current;
    pending.current = null;
    if (action?.type === 'navigate') scrollToId(action.sectionId);
    if (action?.type === 'open-project') requestOpenProject(action.projectId);
  };

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-bg/70 px-4 pt-[10vh] backdrop-blur-sm"
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
                <kbd className={kbdClasses}>{commandPaletteText.closeHint}</kbd>
              </div>

              <Command.List className="max-h-[min(60vh,28rem)] overflow-y-auto overscroll-contain p-2">
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
                        className="flex cursor-pointer items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2.5 text-sm text-text data-[selected=true]:border-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                      >
                        <Icon name={command.icon} size={16} className="shrink-0" />
                        <span className="truncate">{command.label}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>

              <div
                aria-hidden="true"
                className="hidden items-center gap-4 border-t border-border px-4 py-2.5 font-mono text-[11px] text-muted sm:flex"
              >
                {commandPaletteText.footer.map((hint) => (
                  <span key={hint.label} className="inline-flex items-center gap-1.5">
                    {hint.keys.map((key) => (
                      <kbd key={key} className={kbdClasses}>
                        {key}
                      </kbd>
                    ))}
                    {hint.label}
                  </span>
                ))}
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
