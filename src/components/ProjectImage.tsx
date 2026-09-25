import { useState, type CSSProperties } from 'react';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { getInitials, hashString } from '@/lib/projects';
import { fillTemplate } from '@/lib/template';

const WIDTH = 1200;
const HEIGHT = 750;

interface ProjectImageProps {
  project: Project;
  className?: string;
  /** Load immediately (e.g. inside an open modal) instead of lazily. */
  eager?: boolean;
}

/**
 * Project image in a fixed 16:10 frame (no layout shift). Behind it sits a generated brand
 * gradient mesh with the project's initials, which stays visible while the image loads and
 * whenever the image is missing or fails.
 */
export function ProjectImage({ project, className = '', eager = false }: ProjectImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    project.image ? 'loading' : 'error',
  );

  // Vary the mesh per project so placeholders don't all look the same.
  const hash = hashString(project.id);
  const meshStyle = {
    '--mesh-x1': `${15 + (hash % 30)}%`,
    '--mesh-y1': `${10 + ((hash >> 3) % 35)}%`,
    '--mesh-x2': `${60 + ((hash >> 5) % 30)}%`,
    '--mesh-y2': `${55 + ((hash >> 7) % 35)}%`,
  } as CSSProperties;

  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden bg-surface ${className}`}
      style={meshStyle}
    >
      {status !== 'loaded' && (
        <div
          aria-hidden="true"
          className="mesh-placeholder absolute inset-0 grid place-items-center"
        >
          <span className="font-heading text-5xl font-bold text-brand-gradient sm:text-6xl">
            {getInitials(project.title)}
          </span>
        </div>
      )}
      {status !== 'error' && (
        <img
          src={project.image}
          alt={fillTemplate(content.projectsUi.imageAlt, { title: project.title })}
          width={WIDTH}
          height={HEIGHT}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
            status === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}
