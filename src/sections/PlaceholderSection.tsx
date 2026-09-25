import { content } from '@/data/content';
import type { SectionId } from '@/data/types';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';

/** Temporary section body until the real section is built. */
export function PlaceholderSection({ id }: { id: SectionId }) {
  return (
    <Section id={id}>
      <Reveal>
        <div className="flex min-h-[40vh] items-center justify-center rounded-2xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="font-mono text-sm text-muted">{content.ui.sectionPlaceholder}</p>
        </div>
      </Reveal>
    </Section>
  );
}
