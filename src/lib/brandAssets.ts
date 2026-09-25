// Logo artwork imported explicitly as URLs, so Vite emits hashed files and a missing logo fails
// the build instead of silently rendering nothing. The SVGs are large traced artwork (~200 KB
// each), so they are always used through <img> and never inlined as components.
import logoUrl from '@/assets/logo.svg?url';
import logoMarkUrl from '@/assets/logo-mark.svg?url';

/** Full stacked logo (logo.svg, 874 x 550 artboard). */
export const logo = { src: logoUrl, width: 874, height: 550 } as const;

/** Square symbol (logo-mark.svg, 512 x 512 artboard). */
export const logoMark = { src: logoMarkUrl, width: 512, height: 512 } as const;

/** Height for a given width that keeps the logo's aspect ratio (avoids layout shift). */
export const logoHeightFor = (width: number) => Math.round((width * logo.height) / logo.width);
