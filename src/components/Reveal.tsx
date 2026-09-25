import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const tags = {
  div: motion.div,
  header: motion.header,
  section: motion.section,
  article: motion.article,
  ul: motion.ul,
  ol: motion.ol,
  li: motion.li,
  p: motion.p,
} as const;

type Tag = keyof typeof tags;

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps {
  children: ReactNode;
  as?: Tag;
  className?: string;
  /** Seconds before the animation starts. */
  delay?: number;
  /** Distance in px to slide up from. */
  y?: number;
  /** Stagger RevealItem children instead of animating this element. true = 0.08s. */
  stagger?: boolean | number;
}

/**
 * Fades and slides content up the first time it scrolls into view.
 * With `stagger`, animates its RevealItem children one after another.
 * Renders a plain element (no animation) when prefers-reduced-motion is set.
 */
export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 24,
  stagger = false,
}: RevealProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const staggerChildren = stagger === true ? 0.08 : typeof stagger === 'number' ? stagger : 0;
  const variants: Variants = staggerChildren
    ? { hidden: {}, visible: { transition: { staggerChildren, delayChildren: delay } } }
    : {
        hidden: { opacity: 0, y },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay } },
      };

  const MotionTag = tags[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

/** A child of a staggered Reveal. */
export function RevealItem({
  children,
  as = 'div',
  className,
}: Pick<RevealProps, 'children' | 'as' | 'className'>) {
  const reduced = useReducedMotion();

  if (reduced) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  const MotionTag = tags[as];
  return (
    <MotionTag className={className} variants={itemVariants}>
      {children}
    </MotionTag>
  );
}
