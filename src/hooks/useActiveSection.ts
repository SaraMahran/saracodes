import { useEffect, useState } from 'react';

/**
 * Returns the id of the section crossing a band near the top third of the viewport.
 * Uses IntersectionObserver, with a bottom-of-page fallback so the last section can become
 * active even when it is too short to reach the band.
 */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const key = ids.join('|');

  useEffect(() => {
    const sectionIds = key.split('|').filter(Boolean);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const visible = new Set<string>();
    let frame = 0;

    const pick = () => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }
      const first = sectionIds.find((id) => visible.has(id));
      if (first) setActive(first);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        pick();
      },
      { rootMargin: '-30% 0px -65% 0px' },
    );
    elements.forEach((el) => observer.observe(el));

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
