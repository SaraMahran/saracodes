import { useEffect, useState, type FocusEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import type { Testimonial } from '@/data/types';
import { iconButtonClasses } from '@/lib/button';
import { fillTemplate } from '@/lib/template';

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD = 60;

interface CarouselLabels {
  label: string;
  previous: string;
  next: string;
  slideLabel: string;
  goTo: string;
}

interface TestimonialCarouselProps {
  items: Testimonial[];
  labels: CarouselLabels;
}

/**
 * Testimonials carousel: auto-advances every 6s (never under reduced motion), pauses on hover or
 * focus, and supports arrow buttons, dots and swiping. Announces slide changes only while
 * paused, so auto-advance doesn't interrupt screen reader users.
 */
export function TestimonialCarousel({ items, labels }: TestimonialCarouselProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const count = items.length;
  const paused = hovered || focused;

  const go = (next: number, dir: number) => {
    setDirection(dir);
    setIndex(((next % count) + count) % count);
  };

  useEffect(() => {
    if (reduced || paused || count < 2) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setIndex((current) => (current + 1) % count);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(timer);
  }, [reduced, paused, count]);

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(index + 1, 1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(index - 1, -1);
  };

  if (count === 0) return null;
  const item = items[Math.min(index, count - 1)];

  return (
    <section
      aria-roledescription="carousel"
      aria-label={labels.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={onBlur}
      className="relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-6 sm:p-10"
    >
      <div aria-live={paused || reduced ? 'polite' : 'off'} className="min-h-[12rem]">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.figure
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={fillTemplate(labels.slideLabel, { index: index + 1, total: count })}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={count > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={onDragEnd}
            className="cursor-grab touch-pan-y active:cursor-grabbing"
          >
            <Quote size={28} aria-hidden className="mb-4 text-tertiary" />
            <blockquote className="text-lg leading-relaxed text-text sm:text-xl">
              <p>{item.quote}</p>
            </blockquote>
            <figcaption className="mt-6">
              <span className="block font-heading font-semibold text-text">{item.name}</span>
              <span className="font-mono text-xs text-muted">{item.role}</span>
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="no-print mt-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            {items.map((testimonial, dotIndex) => (
              <button
                key={`${testimonial.name}-${dotIndex}`}
                type="button"
                onClick={() => go(dotIndex, dotIndex > index ? 1 : -1)}
                aria-label={fillTemplate(labels.goTo, { index: dotIndex + 1 })}
                aria-current={dotIndex === index ? 'true' : undefined}
                className="flex h-8 w-8 items-center justify-center rounded-full"
              >
                <span
                  aria-hidden="true"
                  className={`block h-2 rounded-full transition-all duration-300 ${
                    dotIndex === index ? 'w-6 bg-primary' : 'w-2 bg-border hover:bg-tertiary'
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              aria-label={labels.previous}
              className={`${iconButtonClasses} h-10 w-10`}
            >
              <ChevronLeft size={18} aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              aria-label={labels.next}
              className={`${iconButtonClasses} h-10 w-10`}
            >
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
