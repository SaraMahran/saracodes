import { content } from '@/data/content';
import type { Project } from '@/data/types';

export interface ProjectFilter {
  /** URL value for ?filter=, e.g. "react". */
  id: string;
  label: string;
  kind: 'all' | 'group' | 'stack';
  matches: (project: Project) => boolean;
}

export const ALL_FILTER = 'all';

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const { projects, projectsUi } = content;

/** Every stack item used by any project, most used first, then alphabetical. */
function stackFilters(): ProjectFilter[] {
  const counts = new Map<string, number>();
  for (const project of projects) {
    for (const item of project.stack) counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .map(([item]) => ({
      id: slugify(item),
      label: item,
      kind: 'stack' as const,
      matches: (project: Project) => project.stack.includes(item),
    }));
}

export const projectFilters: ProjectFilter[] = [
  { id: ALL_FILTER, label: projectsUi.filterAll, kind: 'all', matches: () => true },
  {
    id: 'professional',
    label: projectsUi.filterProfessional,
    kind: 'group',
    matches: (project) => project.confidential,
  },
  {
    id: 'own',
    label: projectsUi.filterOwn,
    kind: 'group',
    matches: (project) => !project.confidential,
  },
  ...stackFilters(),
];

export const isProjectFilter = (id: string) => projectFilters.some((filter) => filter.id === id);

export const findProjectFilter = (id: string) =>
  projectFilters.find((filter) => filter.id === id) ?? projectFilters[0];

/** Up to two initials from the title, e.g. "Baed Connect" -> "BC", "Wanas" -> "W". */
export function getInitials(title: string) {
  return title
    .split(/\s+/)
    .filter((word) => /^[a-z0-9]/i.test(word))
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');
}

/** Stable small number from a string, used to vary placeholder artwork per project. */
export function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  return hash;
}

/** id of a project card's open button, used to return focus after the case study closes. */
export const projectCardButtonId = (id: string) => `project-${id}-button`;
