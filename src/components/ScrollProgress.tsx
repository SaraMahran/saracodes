import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion';

/** Thin brand-gradient bar at the very top that fills as the page scrolls. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const smoothed = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-brand-gradient"
      style={{ scaleX: reduced ? scrollYProgress : smoothed }}
    />
  );
}
