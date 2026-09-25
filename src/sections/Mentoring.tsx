import { CheckCircle2 } from 'lucide-react';
import { AnimatedStat } from '@/components/AnimatedStat';
import { ChipList } from '@/components/Chip';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { content } from '@/data/content';
import { useContactForm } from '@/hooks/useContactForm';
import { buttonClasses } from '@/lib/button';
import { handleAnchorClick } from '@/lib/scroll';
import { isFilled } from '@/lib/todo';

const { mentoring } = content;
const stats = mentoring.stats.filter((stat) => isFilled(stat.value));
const testimonials = mentoring.testimonials.filter(
  (testimonial) => isFilled(testimonial.quote) && isFilled(testimonial.name),
);

export function Mentoring() {
  const { setSubject } = useContactForm();

  return (
    <Section id="mentoring">
      <Reveal>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{mentoring.intro}</p>
      </Reveal>

      {stats.length > 0 && (
        <Reveal className="mt-12 rounded-3xl bg-brand-gradient p-px">
          <dl
            aria-label={mentoring.statsLabel}
            className="grid grid-cols-2 gap-px overflow-hidden rounded-[calc(1.5rem-1px)] bg-border lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse justify-end gap-2 bg-surface p-5 sm:p-7"
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

      <div className="mt-14 grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <h3 className="section-label mb-5">{mentoring.topicsHeading}</h3>
          <Reveal stagger as="ul" className="grid gap-3 sm:grid-cols-2">
            {mentoring.topics.map((topic) => (
              <RevealItem
                key={topic}
                as="li"
                className="flex items-center gap-3 rounded-xl border border-border bg-surface/70 px-4 py-3.5 text-sm font-medium text-text"
              >
                <CheckCircle2 size={18} aria-hidden className="shrink-0 text-primary" />
                {topic}
              </RevealItem>
            ))}
          </Reveal>
        </div>

        <Reveal className="flex flex-col items-start">
          <h3 className="section-label mb-5">{mentoring.formatsHeading}</h3>
          <ChipList items={mentoring.formats} />
          <a
            href="#contact"
            onClick={(event) => {
              setSubject(mentoring.ctaSubject, mentoring.ctaProjectType);
              handleAnchorClick(event, 'contact');
            }}
            className={buttonClasses('secondary', 'lg', 'no-print mt-8 w-full sm:w-auto')}
          >
            {mentoring.cta}
          </a>
        </Reveal>
      </div>

      {testimonials.length > 0 && (
        <Reveal className="mt-16">
          <h3 className="section-label mb-5">{mentoring.testimonialsHeading}</h3>
          <TestimonialCarousel items={testimonials} labels={mentoring.carousel} />
        </Reveal>
      )}
    </Section>
  );
}
