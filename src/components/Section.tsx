import type { ReactNode } from 'react';
import type { SectionId } from '@/data/types';
import { formatSectionLabel, getSection } from '@/lib/sections';
import { Reveal } from './Reveal';

interface SectionProps {
  id: SectionId;
  children?: ReactNode;
  className?: string;
  /** Skip the numbered label and heading (e.g. for the hero, which has its own h1). */
  hideHeader?: boolean;
  /** Vertical padding classes; override for sections with custom spacing such as the hero. */
  spacing?: string;
}

/**
 * Page section with consistent padding and max width, an anchor id, and a numbered mono label
 * (e.g. "// 02. services") above its heading. Label and heading come from content.sections.
 */
export function Section({
  id,
  children,
  className = '',
  hideHeader = false,
  spacing = 'py-20 md:py-28',
}: SectionProps) {
  const section = getSection(id);
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      tabIndex={-1}
      aria-labelledby={hideHeader ? undefined : headingId}
      className={`scroll-mt-16 px-4 focus:outline-none sm:px-6 lg:px-8 ${spacing} ${className}`}
    >
      <div className="mx-auto w-full max-w-6xl">
        {!hideHeader && (
          <Reveal as="header" className="mb-12 md:mb-16">
            <p className="mb-3 font-mono text-sm text-primary">
              {formatSectionLabel(section.index, section.eyebrow)}
            </p>
            <h2 id={headingId}>{section.heading}</h2>
            {section.subheading && (
              <p className="mt-4 max-w-2xl text-lg text-muted">{section.subheading}</p>
            )}
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
