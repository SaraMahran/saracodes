import { content } from '@/data/content';
import type { SectionId } from '@/data/types';

export const sectionIds: readonly SectionId[] = content.sections.map((section) => section.id);

export const navSections = content.sections.filter((section) => section.inNav);

/** Section metadata plus its position, used for numbered labels like "// 02. services". */
export function getSection(id: SectionId) {
  const index = content.sections.findIndex((section) => section.id === id);
  return { ...content.sections[Math.max(0, index)], index: Math.max(0, index) };
}

export const formatSectionLabel = (index: number, eyebrow: string) =>
  `// ${String(index).padStart(2, '0')}. ${eyebrow}`;
