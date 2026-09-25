import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Modal } from '@/components/Modal';
import { ProjectCard } from '@/components/ProjectCard';
import { ProjectCaseStudy, ProjectPager } from '@/components/ProjectCaseStudy';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { useQueryParam } from '@/hooks/useQueryParam';
import {
  ALL_FILTER,
  fillTemplate,
  findProjectFilter,
  isProjectFilter,
  projectCardButtonId,
  projectFilters,
} from '@/lib/projects';

const { projects, projectsUi } = content;
const MODAL_TITLE_ID = 'project-modal-title';

export function Projects() {
  const [filterId, setFilterId] = useQueryParam('filter', isProjectFilter, ALL_FILTER);
  const filter = findProjectFilter(filterId);
  const visible = useMemo(() => projects.filter(filter.matches), [filter]);

  // Keep the selected project while the modal animates out.
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const selectedIndex = Math.max(
    0,
    visible.findIndex((project) => project.id === selectedId),
  );
  const selected = visible[selectedIndex] as Project | undefined;
  const lastShownId = useRef<string | null>(null);

  const openProject = (project: Project) => {
    setSelectedId(project.id);
    setOpen(true);
  };

  const step = (delta: number) => {
    if (visible.length === 0) return;
    const next = (selectedIndex + delta + visible.length) % visible.length;
    setSelectedId(visible[next].id);
  };

  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  });

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
        <div role="group" aria-label={projectsUi.filterLabel} className="mb-4 flex flex-wrap gap-2">
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

        <p className="mb-8 font-mono text-xs text-muted" aria-live="polite">
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

      <Modal
        open={open && Boolean(selected)}
        onClose={close}
        labelledBy={MODAL_TITLE_ID}
        onExitComplete={onExitComplete}
        size="lg"
        scrollKey={selected?.id}
      >
        {selected && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.18 }}
            >
              <ProjectCaseStudy project={selected} titleId={MODAL_TITLE_ID} />
            </motion.div>
          </AnimatePresence>
        )}
        <div className="mt-6">
          <ProjectPager
            index={selectedIndex}
            total={visible.length}
            onPrevious={() => step(-1)}
            onNext={() => step(1)}
          />
        </div>
      </Modal>
    </Section>
  );
}
