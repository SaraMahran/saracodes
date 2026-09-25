import { ArrowLeft, ArrowRight, ExternalLink, Lock } from 'lucide-react';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { buttonClasses, iconButtonClasses } from '@/lib/button';
import { fillTemplate } from '@/lib/projects';
import { isFilled } from '@/lib/todo';
import { GitHubIcon } from './BrandIcons';
import { ChipList } from './Chip';
import { ConfidentialBadge } from './ConfidentialBadge';
import { ProjectImage } from './ProjectImage';

const { projectsUi } = content;

interface ProjectCaseStudyProps {
  project: Project;
  titleId: string;
}

/** Case study body shown inside the project modal. TODO fields are hidden. */
export function ProjectCaseStudy({ project, titleId }: ProjectCaseStudyProps) {
  const details = [
    { heading: projectsUi.problemHeading, text: project.problem },
    { heading: projectsUi.solutionHeading, text: project.solution },
    { heading: projectsUi.outcomeHeading, text: project.outcome },
  ].filter((detail) => isFilled(detail.text));

  const live = project.confidential ? undefined : project.links?.live;
  const repo = project.confidential ? undefined : project.links?.repo;
  const hasLinks = isFilled(live) || isFilled(repo);

  return (
    <div className="flex flex-col gap-6">
      <ProjectImage project={project} eager className="rounded-xl border border-border" />

      <div>
        <div className="mb-2 flex flex-wrap items-center gap-3">
          <p className="font-mono text-xs uppercase tracking-widest text-primary">
            {project.category}
          </p>
          {project.confidential && <ConfidentialBadge />}
        </div>
        <h3 id={titleId} className="text-3xl">
          {project.title}
        </h3>
        <p className="mt-3 text-muted">{project.summary}</p>
      </div>

      {project.confidential && (
        <p className="flex items-start gap-3 rounded-xl border border-tertiary/30 bg-tertiary/5 p-4 text-sm text-muted">
          <Lock size={16} aria-hidden className="mt-0.5 shrink-0 text-tertiary" />
          {projectsUi.confidentialNote}
        </p>
      )}

      {details.map((detail) => (
        <div key={detail.heading}>
          <h4 className="section-label mb-2">{detail.heading}</h4>
          <p className="leading-relaxed text-text">{detail.text}</p>
        </div>
      ))}

      <div>
        <h4 className="section-label mb-3">{projectsUi.stackHeading}</h4>
        <ChipList items={project.stack} />
      </div>

      {hasLinks && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {isFilled(live) && (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('secondary', 'md')}
            >
              <ExternalLink size={16} aria-hidden />
              {projectsUi.liveLink}
            </a>
          )}
          {isFilled(repo) && (
            <a
              href={repo}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClasses('outlinePrimary', 'md')}
            >
              <GitHubIcon size={16} />
              {projectsUi.repoLink}
            </a>
          )}
        </div>
      )}
    </div>
  );
}

interface ProjectPagerProps {
  index: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

/** Previous / next controls. Rendered outside the swapping content so focus stays put. */
export function ProjectPager({ index, total, onPrevious, onNext }: ProjectPagerProps) {
  if (total < 2) return null;
  return (
    <div className="flex items-center justify-between gap-4 border-t border-border pt-5">
      <button
        type="button"
        onClick={onPrevious}
        aria-label={projectsUi.previous}
        aria-keyshortcuts="ArrowLeft"
        className={`${iconButtonClasses} h-10 w-10`}
      >
        <ArrowLeft size={18} aria-hidden />
      </button>
      <p className="font-mono text-xs text-muted" aria-live="polite">
        {fillTemplate(projectsUi.position, { index: index + 1, total })}
      </p>
      <button
        type="button"
        onClick={onNext}
        aria-label={projectsUi.next}
        aria-keyshortcuts="ArrowRight"
        className={`${iconButtonClasses} h-10 w-10`}
      >
        <ArrowRight size={18} aria-hidden />
      </button>
    </div>
  );
}
