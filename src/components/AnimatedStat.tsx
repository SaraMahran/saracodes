import { useEffect, useMemo, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
import { formatStatNumber, parseStatValue } from '@/lib/stat';

interface AnimatedStatProps {
  value: string;
  className?: string;
  /** Seconds. */
  duration?: number;
}

/**
 * Counts a stat up from zero the first time it scrolls into view. Only the numeric part moves;
 * prefix, range separator and decimals are preserved, and the suffix fades in at the end
 * ("99.4%+" counts 0.0 to 99.4, then shows "%+"). Instant under reduced motion, and plain text
 * when the value can't be parsed. Screen readers always get the final value.
 */
export function AnimatedStat({ value, className = '', duration = 1.6 }: AnimatedStatProps) {
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView || reduced || !parsed) return;
    const controls = animate(0, 1, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: setProgress,
    });
    return () => controls.stop();
  }, [inView, reduced, parsed, duration]);

  if (!parsed) return <span className={className}>{value}</span>;

  const current = reduced ? 1 : progress;
  const done = current >= 1;
  const [first, second] = parsed.numbers.map((number) =>
    formatStatNumber(number, done ? number.value : number.value * current),
  );

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true" className="tabular-nums">
        {parsed.prefix}
        {first}
        {second !== undefined && (
          <>
            {parsed.separator}
            {second}
          </>
        )}
        <span className={`transition-opacity duration-300 ${done ? 'opacity-100' : 'opacity-0'}`}>
          {parsed.suffix}
        </span>
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
