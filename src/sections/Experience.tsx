import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { Experience as ExperienceEntry } from '@/data/types';
import { isFilled, isTodo } from '@/lib/todo';

const { experience, education, experienceUi } = content;

/** Entries with a TODO role or any TODO highlight are not ready to show. */
const isReady = (entry: ExperienceEntry) =>
  isFilled(entry.role) &&
  entry.highlights.length > 0 &&
  !entry.highlights.some((highlight) => isTodo(highlight));

const entries = experience.filter(isReady);

function TimelineEntry({ entry, index }: { entry: ExperienceEntry; index: number }) {
  const onLeft = index % 2 === 0;

  return (
    <Reveal
      as="li"
      className={`relative pl-12 md:w-1/2 md:pl-0 ${onLeft ? 'md:pr-12' : 'md:ml-auto md:pl-12'}`}
    >
      <span
        aria-hidden="true"
        className={`absolute left-4 top-7 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-primary bg-bg ring-4 ring-bg ${
          onLeft ? 'md:left-auto md:right-0 md:translate-x-1/2' : 'md:left-0 md:-translate-x-1/2'
        }`}
      />
      <article className="rounded-2xl border border-border bg-surface/70 p-6 transition-colors hover:border-tertiary/60">
        {isFilled(entry.period) && (
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
            {entry.period}
          </p>
        )}
        <h3 className="text-xl">{entry.role}</h3>
        <p className="mt-1 font-medium text-muted">{entry.org}</p>
        <ul className="mt-4 flex flex-col gap-2.5">
          {entry.highlights.map((highlight) => (
            <li key={highlight} className="flex gap-3 text-sm leading-relaxed text-muted">
              <span
                aria-hidden="true"
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-tertiary"
              />
              {highlight}
            </li>
          ))}
        </ul>
      </article>
    </Reveal>
  );
}

export function Experience() {
  const timelineRef = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 0.75', 'end 0.6'],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <Section id="experience">
      {entries.length > 0 && (
        <div className="relative">
          {/* Track (left on mobile, centered on desktop) and the scroll-drawn gradient line. */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[calc(1rem-1px)] top-0 w-0.5 rounded-full bg-border md:left-[calc(50%-1px)]"
          />
          <motion.div
            aria-hidden="true"
            className="absolute bottom-0 left-[calc(1rem-1px)] top-0 w-0.5 origin-top rounded-full bg-brand-gradient-vertical md:left-[calc(50%-1px)]"
            style={{ scaleY: reduced ? 1 : progress }}
          />

          <ol
            ref={timelineRef}
            aria-label={experienceUi.timelineLabel}
            className="relative flex flex-col gap-8 md:gap-12"
          >
            {entries.map((entry, index) => (
              <TimelineEntry key={`${entry.org}-${entry.role}`} entry={entry} index={index} />
            ))}
          </ol>
        </div>
      )}

      <Reveal className="mx-auto mt-16 max-w-xl">
        <h3 className="section-label mb-4 text-center">{experienceUi.educationHeading}</h3>
        <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface/70 p-5 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
            <GraduationCap size={22} aria-hidden />
          </div>
          <div className="min-w-0">
            <p className="font-heading text-lg font-semibold text-text">{education.degree}</p>
            <p className="text-sm text-muted">{education.school}</p>
            <p className="mt-1 font-mono text-xs text-primary">{education.period}</p>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
