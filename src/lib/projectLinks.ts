import { content } from '@/data/content';
import type { Project, ProjectLinks } from '@/data/types';
import { fillTemplate } from './template';
import { isHttpUrl } from './url';

export type ProjectLinkType = keyof ProjectLinks;

export interface ResolvedProjectLink {
  type: ProjectLinkType;
  href: string;
  /** Visible button text, e.g. "Download v1.0.0". */
  label: string;
  /** Accessible name including the project, e.g. "Visit Baed Connect site". */
  ariaLabel: string;
}

const LINK_ORDER: ProjectLinkType[] = ['live', 'repo', 'release'];

/** Version from a release URL tag, e.g. ".../releases/tag/v1.0.0" -> "v1.0.0". */
export function releaseVersion(href: string) {
  const match = /\/releases\/(?:tag|download)\/([^/?#]+)/.exec(href);
  return match ? decodeURIComponent(match[1]) : undefined;
}

/** Link buttons to render for a project, in display order. Confidential projects get none. */
export function getProjectLinks(project: Project): ResolvedProjectLink[] {
  if (project.confidential || !project.links) return [];
  const text = content.projectsUi.links;
  const values = { project: project.title };

  return LINK_ORDER.flatMap((type): ResolvedProjectLink[] => {
    const href = project.links?.[type];
    if (!isHttpUrl(href)) return [];

    if (type === 'release') {
      const version = releaseVersion(href);
      return [
        {
          type,
          href,
          label: version
            ? fillTemplate(text.release.label, { version })
            : text.release.fallbackLabel,
          ariaLabel: version
            ? fillTemplate(text.release.ariaLabel, { ...values, version })
            : fillTemplate(text.release.fallbackAriaLabel, values),
        },
      ];
    }

    return [
      {
        type,
        href,
        label: text[type].label,
        ariaLabel: fillTemplate(text[type].ariaLabel, values),
      },
    ];
  });
}
