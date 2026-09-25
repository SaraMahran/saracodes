import { AnimatedStat } from '@/components/AnimatedStat';
import { ChipList } from '@/components/Chip';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import { isFilled } from '@/lib/todo';

const { about } = content;
const stats = about.stats.filter((stat) => isFilled(stat.value));

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
          {isFilled(about.beyondCode) && (
            <RevealItem as="p" className="border-l-2 border-tertiary/60 pl-4 text-sm text-muted">
              {about.beyondCode}
            </RevealItem>
          )}
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
    </Section>
  );
}
