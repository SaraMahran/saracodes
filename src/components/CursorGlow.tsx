import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const FINE_POINTER = '(hover: hover) and (pointer: fine)';

/**
 * Soft radial glow (tertiary into primary) that follows the mouse. Desktop only: disabled on
 * touch devices and under prefers-reduced-motion. Position is written once per animation frame
 * as a compositor-only transform, so it never triggers layout.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    const update = () => setFinePointer(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const enabled = finePointer && !reduced;

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    let x = 0;
    let y = 0;
    let frame = 0;

    const render = () => {
      frame = 0;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      el.style.opacity = '1';
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onLeave = () => {
      el.style.opacity = '0';
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-glow pointer-events-none fixed left-0 top-0 -z-10 h-[640px] w-[640px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
    />
  );
}
