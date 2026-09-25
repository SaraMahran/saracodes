import { ArrowRight } from 'lucide-react';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { ChipList } from './Chip';
import { ConfidentialBadge } from './ConfidentialBadge';
import { projectCardButtonId } from '@/lib/projects';
import { ProjectImage } from './ProjectImage';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
}

/**
 * Project card. The title button is stretched over the card, so clicking anywhere or pressing
 * Enter opens the case study. The article id matches the command palette anchor.
 */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <article
      id={`project-${project.id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/70 transition-[transform,border-color,box-shadow] duration-300 hover:border-tertiary hover:shadow-glow has-[:focus-visible]:border-tertiary has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-bg motion-safe:hover:-translate-y-1"
    >
      <div className="relative">
        <ProjectImage project={project} className="border-b border-border" />
        {project.confidential && (
          <ConfidentialBadge className="absolute left-3 top-3 bg-surface/90 backdrop-blur" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
          {project.category}
        </p>
        <h3 className="text-xl">
          <button
            type="button"
            id={projectCardButtonId(project.id)}
            onClick={() => onOpen(project)}
            aria-haspopup="dialog"
            className="text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {project.title}
          </button>
        </h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
        <ChipList items={project.stack.slice(0, 4)} className="mt-5" />
        <span
          aria-hidden="true"
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-tertiary"
        >
          {content.projectsUi.viewCaseStudy}
          <ArrowRight
            size={16}
            className="transition-transform motion-safe:group-hover:translate-x-1"
          />
        </span>
      </div>
    </article>
  );
}
