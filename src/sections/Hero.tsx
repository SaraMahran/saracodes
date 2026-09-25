import { useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { CodeWindow } from '@/components/CodeWindow';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import { useTypewriter } from '@/hooks/useTypewriter';
import { buttonClasses } from '@/lib/button';
import { handleAnchorClick } from '@/lib/scroll';

const { hero } = content;

function splitName(name: string, highlight: string) {
  const index = name.lastIndexOf(highlight);
  if (!highlight || index === -1) return { before: name, highlight: '', after: '' };
  return {
    before: name.slice(0, index),
    highlight,
    after: name.slice(index + highlight.length),
  };
}

const name = splitName(hero.name, hero.nameHighlight);

const BlinkingCursor = ({ className = '' }: { className?: string }) => (
  <span
    aria-hidden="true"
    className={`inline-block w-[0.55em] translate-y-[0.15em] bg-primary motion-safe:animate-blink ${className}`}
  />
);

export function Hero() {
  const reduced = useReducedMotion();
  const role = useTypewriter(hero.roles, { enabled: !reduced });

  return (
    <Section
      id="hero"
      hideHeader
      spacing="pt-12 pb-28 sm:pt-16 lg:py-24"
      className="relative flex items-center lg:min-h-[calc(100svh-4rem)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal stagger className="flex min-w-0 flex-col items-start gap-6">
          <RevealItem as="p" className="font-mono text-sm text-primary">
            {hero.greeting}
            <BlinkingCursor className="ml-1 h-[1.1em]" />
          </RevealItem>

          <RevealItem>
            <h1 className="text-6xl font-bold leading-[1.02]">
              {name.before}
              <span className="text-brand-gradient">{name.highlight}</span>
              {name.after}
            </h1>
          </RevealItem>

          <RevealItem as="p" className="min-h-[1.6em] font-mono text-lg text-text sm:text-xl">
            <span className="sr-only">
              {hero.rolesLabel}: {hero.roles.join(', ')}
            </span>
            <span aria-hidden="true">
              {role}
              <BlinkingCursor className="ml-0.5 h-[1.05em]" />
            </span>
          </RevealItem>

          <RevealItem as="p" className="max-w-xl text-lg text-muted">
            {hero.intro}
          </RevealItem>

          <RevealItem className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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
              className={buttonClasses('outlinePrimary', 'lg')}
            >
              {hero.secondaryCta}
            </a>
          </RevealItem>

          <RevealItem
            as="p"
            className="inline-flex items-center gap-2.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-sm text-text"
          >
            <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-secondary" />
            </span>
            {hero.availability}
          </RevealItem>
        </Reveal>

        <Reveal delay={0.3} className="relative hidden min-w-0 lg:block">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl"
          />
          <CodeWindow snippet={hero.code} />
        </Reveal>
      </div>

      <a
        href="#about"
        onClick={(event) => handleAnchorClick(event, 'about')}
        aria-label={hero.scrollHintLabel}
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-md font-mono text-xs text-muted no-underline hover:text-tertiary"
      >
        <span aria-hidden="true">{hero.scrollHint}</span>
        <ChevronDown size={18} aria-hidden className="motion-safe:animate-bounce" />
      </a>
    </Section>
  );
}
