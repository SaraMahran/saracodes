import { useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { AnimatedStat } from '@/components/AnimatedStat';
import { AvailabilityBadge } from '@/components/AvailabilityBadge';
import { CodeWindow } from '@/components/CodeWindow';
import { DownloadCvLink } from '@/components/DownloadCvLink';
import { Reveal, RevealItem } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { content } from '@/data/content';
import { useTypewriter } from '@/hooks/useTypewriter';
import { logoMark } from '@/lib/brandAssets';
import { buttonClasses } from '@/lib/button';
import { handleAnchorClick } from '@/lib/scroll';

const { hero } = content;
const HERO_ACCENT_SIZE = 480;

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

/** Splits the tagline so its last two words can take the brand gradient. */
function splitTagline(text: string) {
  const words = text.trim().split(/\s+/);
  const highlight = words.slice(-2).join(' ');
  const lead = words.slice(0, -2).join(' ');
  return { lead: lead ? `${lead} ` : '', highlight };
}

const tagline = splitTagline(hero.tagline);

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
      spacing="pt-10 pb-24 sm:pt-14 lg:pb-14 lg:pt-8"
      className="relative flex items-center lg:min-h-[calc(100svh-4rem)]"
    >
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <Reveal stagger className="flex min-w-0 flex-col items-start gap-4 xl:gap-5">
          <RevealItem as="p" className="font-mono text-sm text-primary">
            {hero.greeting}
            <BlinkingCursor className="ml-1 h-[1.1em]" />
          </RevealItem>

          {/* Not animated: the name is the LCP element, so it paints immediately. */}
          <h1 className="text-6xl font-bold leading-[1.02]">
            {name.before}
            <span className="text-brand-gradient">{name.highlight}</span>
            {name.after}
          </h1>

          {/* Single line with reserved height, so typing never shifts the layout. */}
          <RevealItem
            as="p"
            className="min-h-[1.6em] whitespace-nowrap font-mono text-base text-text sm:text-xl"
          >
            <span className="print-reveal sr-only">
              {hero.rolesLabel}: {hero.roles.join(', ')}
            </span>
            <span aria-hidden="true" className="no-print">
              {role}
              <BlinkingCursor className="ml-0.5 h-[1.05em]" />
            </span>
          </RevealItem>

          <RevealItem
            as="p"
            className="max-w-xl text-balance font-heading text-2xl font-semibold leading-snug text-text"
          >
            {tagline.lead}
            <span className="text-brand-gradient">{tagline.highlight}</span>
          </RevealItem>

          <RevealItem as="p" className="-mt-2 max-w-xl text-lg text-muted">
            {hero.intro}
          </RevealItem>

          <RevealItem className="no-print flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
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

          <RevealItem>
            <ul aria-label={hero.proofLabel} className="grid w-full max-w-xl grid-cols-3">
              {/* One row of three: number over label, separated by subtle dividers. Labels wrap
                  inside their column on narrow screens. */}
              {hero.proof.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col gap-0.5 border-l border-border px-3 first:border-l-0 first:pl-0 sm:px-5"
                >
                  <AnimatedStat
                    value={item.value}
                    className="font-mono text-lg font-semibold text-text"
                  />
                  <span className="text-xs leading-snug text-muted sm:text-sm">{item.label}</span>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <AvailabilityBadge label={hero.availability} />
            <DownloadCvLink variant="ghost" size="sm" className="-ml-1" />
          </RevealItem>
        </Reveal>

        <Reveal delay={0.3} className="no-print relative hidden min-w-0 lg:block">
          <div
            aria-hidden="true"
            className="absolute -inset-6 rounded-[2rem] bg-brand-gradient opacity-20 blur-3xl"
          />
          {/* Faint brand accent behind the card: decorative, out of layout, desktop and screen only. */}
          <img
            src={logoMark.src}
            alt=""
            aria-hidden="true"
            width={HERO_ACCENT_SIZE}
            height={HERO_ACCENT_SIZE}
            loading="lazy"
            decoding="async"
            className="no-print pointer-events-none absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2 select-none opacity-[0.07] blur-[2px]"
            style={{ width: HERO_ACCENT_SIZE, height: HERO_ACCENT_SIZE }}
          />
          <CodeWindow snippet={hero.code} />
        </Reveal>
      </div>

      <a
        href="#about"
        onClick={(event) => handleAnchorClick(event, 'about')}
        aria-label={hero.scrollHintLabel}
        className="no-print absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 rounded-md font-mono text-xs text-muted no-underline hover:text-tertiary lg:[@media(max-height:940px)]:hidden"
      >
        <span aria-hidden="true">{hero.scrollHint}</span>
        <ChevronDown size={18} aria-hidden className="motion-safe:animate-bounce" />
      </a>
    </Section>
  );
}
