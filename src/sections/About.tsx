import { AnimatedStat } from '@/components/AnimatedStat';
import { ChipList } from '@/components/Chip';
import { Icon } from '@/components/Icon';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import { isFilled, withoutTodo } from '@/lib/todo';

const { about } = content;
const stats = about.stats.filter((stat) => isFilled(stat.value));

// Items render even while their text has an inline "(TODO: ...)" note; only the note is dropped.
const beyondCodeItems = (about.beyondCode?.items ?? [])
  .map((item) => ({ ...item, text: withoutTodo(item.text) }))
  .filter((item) => isFilled(item.title));

export function About() {
  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Reveal stagger className="flex flex-col gap-5">
          {about.paragraphs.map((paragraph) => (
            <RevealItem key={paragraph} as="p" className="text-lg leading-relaxed text-muted">
              {paragraph}
            </RevealItem>
          ))}
        </Reveal>

        {stats.length > 0 && (
          <Reveal delay={0.15}>
            <dl aria-label={about.statsLabel} className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col-reverse justify-end gap-2 rounded-2xl border border-border bg-surface/70 p-4 sm:p-6"
                >
                  <dt className="text-sm text-muted">{stat.label}</dt>
                  <dd className="font-heading text-3xl font-bold sm:text-4xl">
                    <AnimatedStat value={stat.value} className="text-brand-gradient" />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}
      </div>

      <Reveal className="mt-14 md:mt-16">
        <h3 className="section-label mb-4">{about.techStackHeading}</h3>
        <ChipList items={about.techStack} />
      </Reveal>

      {about.beyondCode && beyondCodeItems.length > 0 && (
        <div className="mt-14 md:mt-16">
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
