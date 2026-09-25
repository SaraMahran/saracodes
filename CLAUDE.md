# CLAUDE.md

SaraCodes is the business portfolio of Sara Ali Mahran (saramahran.com, sara@saramahran.com).
It is proof of an independent software business for contractor onboarding review and Sara's public
freelance and mentoring presence. Every design decision should present her as an independent
professional offering services to the public: Services section, "Hire me" call to action, contact
details, and consistent branding.

Stack: Vite, React 18, TypeScript, Tailwind CSS v3, Framer Motion, lucide-react, cmdk. npm only.
No backend, no database.

## Standing rules

1. Never create `.sql` migration files under `migrations/` or anywhere else. If any database schema
   or data change is ever needed, give the SQL directly in chat for manual execution.
2. Never set a PgBouncer/database connection pool to read-only and never issue session-level `SET`
   statements (e.g. `SET default_transaction_read_only`) against any shared or production
   connection pool.
3. Do not run full test suites by default. Only run the specific checks relevant to the change
   (e.g. `npm run build`, `npm run lint`, or a specific test file). A full run is only an optional
   final check.
4. Never commit or push automatically. At the end of each task, give the commit message separately
   in this format:
   - first line: `<type>(<scope>): <short summary>`
   - then a body explaining what changed and why
   - then an optional issue reference or breaking-change note
   - never use dashes as punctuation in commit messages
5. All user-facing content lives in `src/data/` and is never hardcoded inside components.
6. Every interactive element must be keyboard accessible and every animation must respect
   `prefers-reduced-motion`.
7. Colors: always use the `primary` / `secondary` / `tertiary` / `brand-gradient` tokens. Never
   introduce new accent colors.
8. Never modify `src/assets/logo.svg` or `src/assets/logo-mark.svg`.

## Design system: Midnight Bloom (dark by default)

Tokens are CSS variables (RGB channels) in `src/styles/globals.css`, mapped in `tailwind.config.ts`.

| Token       | Dark      | Light     | Use                                           |
| ----------- | --------- | --------- | --------------------------------------------- |
| `bg`        | `#0B0F14` | `#FFFFFF` | page background                               |
| `surface`   | `#131A23` | `#F4F6F9` | cards, panels                                 |
| `border`    | `#1F2A37` | `#D8DEE6` | dividers, outlines                            |
| `text`      | `#E6EDF3` | `#0B0F14` | body text                                     |
| `muted`     | `#8B98A5` | `#4B5866` | secondary text                                |
| `primary`   | `#8BBBFF` | `#1F5FC2` | links, focus rings, active states             |
| `secondary` | `#FF89CA` | `#B8266F` | main CTAs, badges, key highlights (sparingly) |
| `tertiary`  | `#C8A5FD` | `#6D3FC4` | hover states, gradient midpoints              |
| `on-accent` | `#0B0F14` | `#FFFFFF` | text on filled primary / secondary buttons    |

- `bg-brand-gradient` / `text-brand-gradient`: pink to violet to blue, for the hero name, scroll
  progress bar and logo glow.
- Filled primary or secondary buttons use `text-on-accent` (dark `#0B0F14` in the dark theme).
- All text tokens pass WCAG AA against `bg` and `surface` in both themes. Recheck if you change one.
- Themes switch via `data-theme="dark" | "light"` on `<html>`.
- Fonts: Poppins 600/700 (`font-heading`), Inter 400/500/600 (`font-sans`), JetBrains Mono
  (`font-mono`, section labels, tags, command palette), self-hosted via `@fontsource` (imported in
  `src/main.tsx`). The build preloads Poppins 600/700 and Inter 400 (latin). Font sizes are fluid
  via `clamp()`.
- Framer Motion is wrapped in `<MotionConfig reducedMotion="user">`; `globals.css` also disables
  CSS animation under `prefers-reduced-motion: reduce`.
- Print: `globals.css` prints a light, static document. Mark screen-only UI with `no-print`,
  print-only content with `print-only`, and visually hidden text that should print with
  `print-reveal`.

## Structure

- `src/components` reusable UI, `src/components/dialogs` code-split dialogs, `src/sections` page
  sections, `src/pages/NotFound.tsx` the 404 page, `src/data` all copy and content, `src/hooks`,
  `src/lib` helpers, `src/styles/globals.css` base styles, tokens and print styles.
- Dialogs and the command palette are lazy-loaded through `src/lib/lazy.ts`, mounted on first
  open and prefetched when the browser is idle. Full-screen layers (mobile menu, `Modal`) render
  through a portal to `<body>`, because the navbar's `backdrop-filter` would clip fixed children.
- Logos are imported as URLs in `src/lib/brandAssets.ts` (a missing file fails the build) and
  always rendered with `<img>` and explicit width/height, never inlined (they are ~200 KB each).
- SEO: `<title>`, meta, Open Graph, Twitter and JSON-LD tags are generated from `content.seo` by
  the plugins in `vite.config.ts`, which also copies `index.html` to `404.html` and warns about
  missing public files. `public/robots.txt` and `public/sitemap.xml` are static.
- `brand/` holds source brand files. `npm run brand` moves them into `src/assets` and `public/`,
  regenerates `favicon.svg`, `favicon-32x32.png`, `apple-touch-icon.png` and `icon-512.png`,
  converts screenshots in `brand/projects/<project-id>.png|jpg` to `public/projects/*.webp`, and
  then runs `npm run og` to regenerate `public/og-image.png`.

## Commands

- `npm run dev`, `npm run build`, `npm run lint`, `npm run format`, `npm run brand`, `npm run og`
