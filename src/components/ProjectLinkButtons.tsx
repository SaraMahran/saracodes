import type { ReactNode } from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { content } from '@/data/content';
import type { Project } from '@/data/types';
import { buttonClasses } from '@/lib/button';
import { fillTemplate } from '@/lib/template';
import { getProjectLinks, type ProjectLinkType } from '@/lib/projectLinks';
import { GitHubIcon } from './BrandIcons';

const icons: Record<ProjectLinkType, ReactNode> = {
  live: <ExternalLink size={16} aria-hidden />,
  repo: <GitHubIcon size={16} />,
  release: <Download size={16} aria-hidden />,
};

interface ProjectLinkButtonsProps {
  project: Project;
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Visit site / View code / Download buttons for a project. Renders nothing for confidential
 * projects or when no link is a real URL. All links open in a new tab.
 */
export function ProjectLinkButtons({
  project,
  size = 'md',
  className = '',
}: ProjectLinkButtonsProps) {
  const links = getProjectLinks(project);
  if (links.length === 0) return null;

  return (
    <ul
      aria-label={fillTemplate(content.projectsUi.linksLabel, { project: project.title })}
      className={`flex flex-wrap gap-2 ${className}`}
    >
      {links.map((link) => (
        <li key={link.type}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            className={buttonClasses(link.type === 'live' ? 'secondary' : 'outlinePrimary', size)}
          >
            {icons[link.type]}
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
