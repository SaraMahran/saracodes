import { content } from '@/data/content';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { buttonClasses } from '@/lib/button';
import { handleAnchorClick } from '@/lib/scroll';
import { formatSectionLabel, getSection } from '@/lib/sections';

const { hero } = content;
const section = getSection('hero');

/** Placeholder hero: name and CTAs so navigation can be tested end to end. */
export function Hero() {
  return (
    <Section id="hero" hideHeader className="flex min-h-[calc(100svh-4rem)] items-center">
      <Reveal stagger className="flex flex-col items-start gap-6">
        <RevealItem as="p" className="font-mono text-sm text-primary">
          {formatSectionLabel(section.index, section.eyebrow)}
        </RevealItem>
        <RevealItem>
          <h1 className="text-6xl text-brand-gradient">{hero.name}</h1>
        </RevealItem>
        <RevealItem as="p" className="max-w-2xl text-lg text-muted">
          {hero.intro}
        </RevealItem>
        <RevealItem className="flex flex-wrap gap-3">
          <a
            href="#contact"
            onClick={(event) => handleAnchorClick(event, 'contact')}
            className={buttonClasses('secondary', 'lg')}
          >
            {hero.primaryCta}
          </a>
          <a
            href="#services"
            onClick={(event) => handleAnchorClick(event, 'services')}
            className={buttonClasses('outline', 'lg')}
          >
            {hero.secondaryCta}
          </a>
        </RevealItem>
      </Reveal>
    </Section>
  );
}
