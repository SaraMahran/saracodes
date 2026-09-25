import { ChipList } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import { isFilled, withoutTodo } from '@/lib/todo';

const { about } = content;

// Items render even while their text has an inline "(TODO: ...)" note; only the note is dropped.
const beyondCodeItems = (about.beyondCode?.items ?? [])
  .map((item) => ({ ...item, text: withoutTodo(item.text) }))
  .filter((item) => isFilled(item.title));

export function About() {
  return (
    <Section id="about">
      {/* Desktop: paragraphs (7/12) beside the Focus areas card (5/12), top-aligned.
          Tablet and mobile: stacked, paragraphs first. */}
      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal stagger className="flex flex-col gap-6 lg:col-span-7">
          {about.paragraphs.map((paragraph) => (
            <RevealItem
              key={paragraph}
              as="p"
              className="max-w-[62ch] text-[1.125rem] leading-[1.75] text-muted"
            >
              {paragraph}
            </RevealItem>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-5">
          <aside
            aria-labelledby="about-focus-heading"
            className="rounded-2xl border border-border bg-surface/70 p-6 sm:p-7"
          >
            <h3 id="about-focus-heading" className="section-label mb-4">
              {about.focusAreasHeading}
            </h3>
            <ul className="flex flex-col gap-3">
              {about.focusAreas.map((area) => (
                <li key={area.text} className="flex items-center gap-3 text-text">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-primary/25 bg-primary/10 text-primary">
                    <Icon name={area.icon} size={18} />
                  </span>
                  {area.text}
                </li>
              ))}
            </ul>

            <h3 className="section-label mb-3 mt-7">{about.techStackHeading}</h3>
            <ChipList items={about.techStack} />
          </aside>
        </Reveal>
      </div>

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
