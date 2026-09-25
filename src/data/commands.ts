import { content } from './content';
import type { IconName, SectionId } from './types';
import { isFilled } from '@/lib/todo';

/**
 * Command palette entries, derived from `content` so they stay in sync with the site.
 * Actions are plain data; the palette component decides how to execute them.
 */
export type CommandAction =
  | { type: 'navigate'; sectionId: SectionId; anchorId?: string }
  | { type: 'open'; href: string; external: boolean }
  | { type: 'copy'; value: string; successMessage: string }
  | { type: 'toggle-theme' };

export interface Command {
  id: string;
  group: string;
  label: string;
  icon: IconName;
  keywords: string[];
  action: CommandAction;
}

export const commandGroups = {
  navigation: 'Navigation',
  actions: 'Actions',
  links: 'Links',
  projects: 'Projects',
} as const;

export const commandPaletteText = {
  placeholder: 'Type a command or search…',
  empty: 'No results found.',
  label: 'Command palette',
  shortcutHint: { mac: '⌘K', other: 'Ctrl K' },
  closeHint: 'Esc',
} as const;

const sectionIcons: Record<SectionId, IconName> = {
  hero: 'House',
  about: 'User',
  services: 'Briefcase',
  projects: 'FolderGit2',
  experience: 'Building',
  mentoring: 'GraduationCap',
  certifications: 'Award',
  contact: 'Mail',
};

const { brand, sections, projects, ui } = content;

const navigationCommands: Command[] = sections.map((section) => ({
  id: `nav-${section.id}`,
  group: commandGroups.navigation,
  label: `Go to ${section.label}`,
  icon: sectionIcons[section.id],
  keywords: [section.label, section.heading, section.id],
  action: { type: 'navigate', sectionId: section.id },
}));

const actionCommands: Command[] = [
  {
    id: 'hire-me',
    group: commandGroups.actions,
    label: ui.hireMe,
    icon: 'Handshake',
    keywords: ['hire', 'project', 'contact', 'freelance', 'quote'],
    action: { type: 'navigate', sectionId: 'contact' },
  },
  {
    id: 'open-cv',
    group: commandGroups.actions,
    label: ui.downloadCv,
    icon: 'FileText',
    keywords: ['cv', 'resume', 'pdf'],
    action: { type: 'open', href: brand.cvPath, external: false },
  },
  {
    id: 'copy-email',
    group: commandGroups.actions,
    label: `${ui.copyEmail} (${brand.email})`,
    icon: 'Copy',
    keywords: ['email', 'mail', 'contact'],
    action: { type: 'copy', value: brand.email, successMessage: ui.emailCopied },
  },
  {
    id: 'toggle-theme',
    group: commandGroups.actions,
    label: 'Toggle light / dark theme',
    icon: 'SunMoon',
    keywords: ['theme', 'dark', 'light', 'mode'],
    action: { type: 'toggle-theme' },
  },
];

const socialLinks = [
  { id: 'github', label: 'Open GitHub', href: brand.socials.github, icon: 'Code' },
  { id: 'linkedin', label: 'Open LinkedIn', href: brand.socials.linkedin, icon: 'Users' },
  { id: 'upwork', label: 'Open Upwork', href: brand.socials.upwork, icon: 'BriefcaseBusiness' },
] satisfies { id: string; label: string; href: string; icon: IconName }[];

const linkCommands: Command[] = socialLinks
  .filter((link) => isFilled(link.href))
  .map((link) => ({
    id: `link-${link.id}`,
    group: commandGroups.links,
    label: link.label,
    icon: link.icon,
    keywords: [link.id, 'social', 'profile'],
    action: { type: 'open', href: link.href, external: true },
  }));

// Projects with a real live or repo link open it; everything else scrolls to the project card.
const projectCommands: Command[] = projects.map((project) => {
  const href = [project.links?.live, project.links?.repo].find(isFilled);
  return {
    id: `project-${project.id}`,
    group: commandGroups.projects,
    label: project.title,
    icon: project.confidential ? 'Lock' : 'FolderOpen',
    keywords: [project.category, ...project.tags, ...project.stack],
    action:
      !project.confidential && href
        ? { type: 'open', href, external: true }
        : { type: 'navigate', sectionId: 'projects', anchorId: `project-${project.id}` },
  };
});

export const commands: Command[] = [
  ...navigationCommands,
  ...actionCommands,
  ...linkCommands,
  ...projectCommands,
];
