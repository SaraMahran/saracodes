import { Fragment } from 'react';
import { Icon } from '@/components/Icon';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import type { TextPart } from '@/data/types';
import { isFilled, withoutTodo } from '@/lib/todo';

const { about } = content;

const toneClasses: Record<NonNullable<TextPart['tone']>, string> = {
  primary: 'text-primary',
  secondary: 'text-secondary',
};

// Items render even while their text has an inline "(TODO: ...)" note; only the note is dropped.
const beyondCodeItems = (about.beyondCode?.items ?? [])
  .map((item) => ({ ...item, text: withoutTodo(item.text) }))
  .filter((item) => isFilled(item.title));

/**
 * About: a centered story (lead sentence + one paragraph), three highlight pillars, then the
 * Beyond code grid. Secondary copy uses text at 80% opacity: brighter than `muted` and still
 * WCAG AA (about 10:1) on bg and surface in both themes.
 */
export function About() {
  return (
    <Section id="about">
      <div className="mx-auto max-w-[760px] text-center">
        <Reveal
          as="p"
          className="font-heading text-[clamp(1.5rem,2.5vw,2rem)] font-semibold leading-[1.35] text-text"
        >
          {about.lead.map((part, index) =>
            part.tone ? (
              <span key={index} className={toneClasses[part.tone]}>
                {part.text}
              </span>
            ) : (
              <Fragment key={index}>{part.text}</Fragment>
            ),
          )}
        </Reveal>
        <Reveal
          as="p"
          delay={0.1}
          className="mx-auto mt-6 max-w-[62ch] text-[1.125rem] leading-[1.75] text-text/80"
        >
          {about.body}
        </Reveal>
      </div>

      <Reveal stagger className="mx-auto mt-12 max-w-[1100px] md:mt-14">
        <ul aria-label={about.pillarsLabel} className="print-cols-3 grid gap-5 md:grid-cols-3">
          {about.pillars.map((pillar) => (
            <RevealItem key={pillar.title} as="li" className="h-full">
              {/* Card styles live on this inner element: Reveal sets an inline transform on the
                  li, which would override the hover lift. */}
              <article className="h-full rounded-2xl border border-border bg-surface/70 p-6 text-left transition-[transform,border-color] duration-300 hover:border-tertiary motion-safe:hover:-translate-y-1 sm:p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
                  <Icon name={pillar.icon} size={22} />
                </span>
                <h3 className="mt-5 font-heading text-xl font-semibold text-text">
                  {pillar.title}
                </h3>
                <p className="mt-2 leading-relaxed text-text/80">{pillar.text}</p>
              </article>
            </RevealItem>
          ))}
        </ul>
      </Reveal>

      {about.beyondCode && beyondCodeItems.length > 0 && (
        <div className="mt-16 md:mt-20">
          <Reveal>
            <h3 className="font-mono text-sm uppercase tracking-[0.2em] text-primary">
              {about.beyondCode.heading}
            </h3>
            {isFilled(about.beyondCode.intro) && (
              <p className="mt-3 max-w-2xl text-muted">{about.beyondCode.intro}</p>
            )}
          </Reveal>

          <Reveal
            stagger
            as="ul"
            className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {beyondCodeItems.map((item) => (
              <RevealItem key={item.title} as="li" className="h-full">
                {/* Card styles live on this inner element: Reveal sets an inline transform on the
                    li, which would override the hover lift. */}
                <article className="h-full rounded-2xl border border-border bg-surface/70 p-5 transition-[transform,border-color] duration-300 hover:border-tertiary motion-safe:hover:-translate-y-1">
                  <Icon name={item.icon} size={22} className="text-tertiary" />
                  <h4 className="mt-4 font-heading text-base font-semibold text-text">
                    {item.title}
                  </h4>
                  {item.text && (
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.text}</p>
                  )}
                </article>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      )}
    </Section>
  );
}
