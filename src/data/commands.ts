import { content } from './content';
import type { IconName, SectionId } from './types';
import { isFilled } from '@/lib/todo';

/**
 * Command palette entries, derived from `content` so they stay in sync with the site.
 * Actions are plain data; the palette component decides how to execute them.
 */
export type CommandAction =
  | { type: 'navigate'; sectionId: SectionId }
  | { type: 'open'; href: string }
  | { type: 'download'; href: string }
  | { type: 'copy-email' }
  | { type: 'toggle-theme' }
  | { type: 'open-project'; projectId: string };

export interface Command {
  id: string;
  group: string;
  label: string;
  icon: IconName;
  keywords: string[];
  action: CommandAction;
}

export const commandGroups = {
  navigate: 'Navigate',
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
  // Keyboard hints shown in the palette footer.
  footer: [
    { keys: ['↑', '↓'], label: 'navigate' },
    { keys: ['↵'], label: 'select' },
    { keys: ['Esc'], label: 'close' },
  ],
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

const { brand, hero, sections, projects, ui } = content;

const navigateCommands: Command[] = sections.map((section) => ({
  id: `nav-${section.id}`,
  group: commandGroups.navigate,
  label: `Go to ${section.label}`,
  icon: sectionIcons[section.id],
  keywords: [section.label, section.heading, section.id],
  action: { type: 'navigate', sectionId: section.id },
}));

const actionCommands: Command[] = [
  {
    id: 'start-project',
    group: commandGroups.actions,
    label: hero.primaryCta,
    icon: 'Handshake',
    keywords: ['hire', 'hire me', 'project', 'contact', 'freelance', 'quote'],
    action: { type: 'navigate', sectionId: 'contact' },
  },
  {
    id: 'download-cv',
    group: commandGroups.actions,
    label: ui.downloadCv,
    icon: 'FileText',
    keywords: ['cv', 'resume', 'pdf'],
    action: { type: 'download', href: brand.cvPath },
  },
  {
    id: 'copy-email',
    group: commandGroups.actions,
    label: `${ui.copyEmail} (${brand.email})`,
    icon: 'Copy',
    keywords: ['email', 'mail', 'contact'],
    action: { type: 'copy-email' },
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

// Links still marked TODO are left out.
const linkCommands: Command[] = socialLinks
  .filter((link) => isFilled(link.href))
  .map((link) => ({
    id: `link-${link.id}`,
    group: commandGroups.links,
    label: link.label,
    icon: link.icon,
    keywords: [link.id, 'social', 'profile'],
    action: { type: 'open', href: link.href },
  }));

const projectCommands: Command[] = projects.map((project) => ({
  id: `project-${project.id}`,
  group: commandGroups.projects,
  label: project.title,
  icon: project.confidential ? 'Lock' : 'FolderOpen',
  keywords: ['case study', project.category, ...project.tags, ...project.stack],
  action: { type: 'open-project', projectId: project.id },
}));

export const commands: Command[] = [
  ...navigateCommands,
  ...actionCommands,
  ...linkCommands,
  ...projectCommands,
];
