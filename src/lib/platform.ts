interface NavigatorWithUAData extends Navigator {
  userAgentData?: { platform?: string };
}

/**
 * True on macOS and iOS, for showing ⌘ instead of Ctrl. Prefers the modern
 * navigator.userAgentData.platform, then the older navigator.platform, then the user agent.
 */
export function isMacLike() {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as NavigatorWithUAData;
  const platform = nav.userAgentData?.platform || nav.platform || nav.userAgent;
  return /mac|iphone|ipad|ipod/i.test(platform);
}
