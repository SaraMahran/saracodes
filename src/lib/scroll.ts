import type { MouseEvent } from 'react';

/** Height of the sticky navbar in px. Matches --nav-height in globals.css. */
export const NAV_HEIGHT = 64;

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Scrolls to an element by id, offset for the sticky navbar, then moves focus there so keyboard
 * and screen reader users continue from the new position.
 */
export function scrollToId(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
  window.scrollTo({ top: Math.max(0, top), behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  window.history.replaceState(null, '', `#${id}`);

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Click handler for in-page anchor links: keeps the native href but uses offset scrolling. */
export function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  scrollToId(id);
}
