import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { usePrefetchOnIdle } from '@/hooks/usePrefetchOnIdle';
import { useQueryParam } from '@/hooks/useQueryParam';
import { LazyProjectDialog, loadProjectDialog } from '@/lib/lazy';
import {
  ALL_FILTER,
  findProjectFilter,
  isProjectFilter,
  projectCardButtonId,
  projectFilters,
} from '@/lib/projects';
import { onOpenProjectRequest } from '@/lib/projectEvents';
import { fillTemplate } from '@/lib/template';

const { projects, projectsUi } = content;

export function Projects() {
  const [filterId, setFilterId] = useQueryParam('filter', isProjectFilter, ALL_FILTER);
  const filter = findProjectFilter(filterId);
  const visible = useMemo(() => projects.filter(filter.matches), [filter]);

  // Keep the selected project while the modal animates out.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const selectedIndex = Math.max(
    0,
    visible.findIndex((project) => project.id === selectedId),
  );
  const selected = visible[selectedIndex] as Project | undefined;
  const lastShownId = useRef<string | null>(null);

  usePrefetchOnIdle(loadProjectDialog);

  const openProject = (project: Project) => {
    setSelectedId(project.id);
    setHasOpened(true);
    setOpen(true);
  };

  // Printing shows every project (with its case study inline), whatever the filter.
  useEffect(() => {
    const onBeforePrint = () => flushSync(() => setFilterId(ALL_FILTER));
    window.addEventListener('beforeprint', onBeforePrint);
    return () => window.removeEventListener('beforeprint', onBeforePrint);
  }, [setFilterId]);

  const step = (delta: number) => {
    if (visible.length === 0) return;
    const next = (selectedIndex + delta + visible.length) % visible.length;
    setSelectedId(visible[next].id);
  };

  const stepRef = useRef(step);
  const visibleRef = useRef(visible);
  useEffect(() => {
    stepRef.current = step;
    visibleRef.current = visible;
  });

  // The command palette can ask for any case study: clear a filter that hides it, bring its
  // card into view behind the modal (so focus returns there on close), then open it.
  useEffect(
    () =>
      onOpenProjectRequest((projectId) => {
        if (!projects.some((project) => project.id === projectId)) return;
        if (!visibleRef.current.some((project) => project.id === projectId)) {
          setFilterId(ALL_FILTER);
        }
        setSelectedId(projectId);
        setHasOpened(true);
        setOpen(true);
        requestAnimationFrame(() =>
          document.getElementById(`project-${projectId}`)?.scrollIntoView({ block: 'center' }),
        );
      }),
    [setFilterId],
  );

  // Arrow keys move between projects while the case study is open.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stepRef.current(1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stepRef.current(-1);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const close = () => {
    lastShownId.current = selected?.id ?? null;
    setOpen(false);
  };

  // The focus trap restores focus to the card that opened the modal; after next/previous,
  // move it to the card of the project that was last shown instead.
  const onExitComplete = () => {
    if (!lastShownId.current) return;
    document.getElementById(projectCardButtonId(lastShownId.current))?.focus();
    lastShownId.current = null;
  };

  return (
    <Section id="projects">
      <Reveal>
        <div
          role="group"
          aria-label={projectsUi.filterLabel}
          className="no-print mb-4 flex flex-wrap gap-2"
        >
          {projectFilters.map((option) => {
            const active = option.id === filter.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setFilterId(option.id)}
                aria-pressed={active}
                className={`relative rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                  option.kind === 'stack' ? 'font-mono text-xs' : 'font-medium'
                } ${
                  active
                    ? 'text-on-accent'
                    : 'border border-border text-muted hover:border-tertiary hover:text-tertiary'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-primary"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                  />
                )}
                <span className="relative">{option.label}</span>
              </button>
            );
          })}
        </div>

        <p className="no-print mb-8 font-mono text-xs text-muted" aria-live="polite">
          {fillTemplate(projectsUi.resultsCount, {
            count: visible.length,
            total: projects.length,
          })}
        </p>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
            {projectsUi.empty}
          </p>
        ) : (
          <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout" initial={false}>
              {visible.map((project) => (
                <motion.li
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ProjectCard project={project} onOpen={openProject} />
                </motion.li>
              ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </Reveal>

      {/* Mounted on first open so the dialog code loads lazily. */}
      {selected && hasOpened && (
        <Suspense fallback={null}>
          <LazyProjectDialog
            open={open}
            project={selected}
            index={selectedIndex}
            total={visible.length}
            onClose={close}
            onExitComplete={onExitComplete}
            onPrevious={() => step(-1)}
            onNext={() => step(1)}
          />
        </Suspense>
      )}
    </Section>
  );
}
