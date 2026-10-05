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

  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus({ preventScroll: true });
}

/** Resolve an incoming fragment once after render, without adding a history entry. */
export function scrollToInitialHash() {
  const hash = window.location.hash;
  if (!hash) return;

  try {
    scrollToId(decodeURIComponent(hash.slice(1)));
  } catch {
    // Malformed fragments have no target, but should still leave a clean address.
  }
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

/** Click handler for in-page anchor links: keeps the native href but uses offset scrolling. */
export function handleAnchorClick(event: MouseEvent<HTMLAnchorElement>, id: string) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  scrollToId(id);
}
