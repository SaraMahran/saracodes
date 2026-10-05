# SaraCodes

Portfolio and business site of **SaraCodes**, the independent software engineering and technical
mentoring practice of Sara Ali Mahran.

Built with Vite, React 18, TypeScript, Tailwind CSS v3, Framer Motion, lucide-react and cmdk.
There is no backend and no database: it is a static site deployed on Vercel.
There are no client-side routes or rewrites. Unknown URLs use the generated `404.html` with
a real 404 status; the home page, section anchors and static files keep their normal URLs.

- Production: https://saracodes.vercel.app (custom domain undecided: saramahran.com or saracodes.net)
- Repository: https://github.com/SaraMahran/saracodes

---

## 1. Local setup

Requirements: Node.js 22 (see `engines` in `package.json`) and npm.

```bash
git clone https://github.com/SaraMahran/saracodes.git
cd saracodes
npm ci
npm run dev        # http://localhost:5173
```

Other scripts:

| Command           | What it does                                                   |
| ----------------- | -------------------------------------------------------------- |
| `npm run dev`     | Dev server with hot reload                                     |
| `npm run build`   | Type-check and production build into `dist/`                   |
| `npm run preview` | Serve the production build locally                             |
| `npm run lint`    | ESLint                                                         |
| `npm run format`  | Prettier                                                       |
| `npm run brand`   | Process brand files, icons and project screenshots (see below) |
| `npm run og`      | Regenerate `public/og-image.png`                               |

---

## 2. Editing content

**All text lives in `src/data/content.ts`.** Components never contain copy. Types are in
`src/data/types.ts`; command palette entries in `src/data/commands.ts` are derived from content.

- Any value starting with `TODO:` is a placeholder and is hidden on the site. Search for `TODO:` to
  find what still needs filling in.
- **Site address and email** are set in exactly one place: `content.brand.siteUrl` and
  `content.brand.email`. Canonical and Open Graph tags, JSON-LD, `robots.txt`, `sitemap.xml`, the
  OG image, mailto links and the contact form all read these values.
- Section order (and the numbered section labels, navbar, command palette and print order) comes
  from `content.sections`.

### Replacing the resume

Put the PDF at `public/Sara_Ali_Mahran_Resume.pdf` (the path in `content.brand.cvPath`), or change
`cvPath` to match the file you add. `npm run build` warns if the file is missing.

### Certificates

Each certificate in `content.certifications` points to files in `public/certificates/`:

- `fileUrl`: the PDF, e.g. `/certificates/mckinsey-forward.pdf`
- `image`: a thumbnail, about 4:3 (660 x 510 works well), e.g. `/certificates/mckinsey-forward.png`
- `credentialUrl`: optional public verification link

Replace a file by saving the new one under the same name, or add a new entry with new paths.

### Project images

Save a screenshot as `brand/projects/<project-id>.png` (or `.jpg`), where `<project-id>` is the
project's `id` in `content.projects` (for example `brand/projects/wanas.png`), then run:

```bash
npm run brand
```

It converts screenshots to optimized WebP in `public/projects/`. Until an image exists, the card
shows a generated brand-gradient placeholder. Confidential projects omit `image` and always
use the gradient initials placeholder; the build checks screenshots only for projects with an image path.

### Logo, favicons and OG image

The logo artwork lives in `src/assets/logo.svg` and `src/assets/logo-mark.svg` (do not edit it).
`npm run brand` regenerates the favicons and app icons in `public/` and then the OG image.
Run `npm run og` on its own after changing `siteUrl`, the tagline or the owner name, so the host
shown on the social preview image stays current. Commit the regenerated `public/og-image.png`.

---

## 3. Contact form (Formspree)

1. Create a form at https://formspree.io and copy its endpoint, e.g. `https://formspree.io/f/abcdwxyz`.
2. In `src/data/content.ts`, set `contact.formEndpoint` to that URL.
3. Build and deploy. Until an endpoint is set, the form opens the visitor's email app with the
   message filled in, addressed to `content.brand.email`.

The Content-Security-Policy in `vercel.json` already allows `https://formspree.io`.

---

## 4. Branch workflow

`main` is the production branch. All work happens on feature branches merged through pull
requests.

```bash
git checkout main
git pull origin main
git checkout -b feat/short-description

# ...make changes...
npm run build            # confirm the production build succeeds
git add -A
git commit
git push -u origin feat/short-description
gh pr create --base main --fill   # or open the pull request on GitHub
```

- Vercel creates a **preview deployment** for every pull request and comments its URL on the PR.
- Merging the pull request into `main` deploys to **production** automatically.
- After merging: `git checkout main && git pull origin main`, then delete the feature branch.

---

## 5. Phase 1: deploy on Vercel's free address

1. Sign in at https://vercel.com with GitHub.
2. **Add New → Project**, then import **SaraMahran/saracodes**. Allow Vercel's GitHub app access to
   the repository if asked.
3. **Project name: `saracodes`**, so the production address is **https://saracodes.vercel.app**.
4. Framework preset: **Vite** (detected automatically; `vercel.json` also sets the build command
   `npm run build` and output directory `dist`).
5. Click **Deploy**.
6. In **Settings → Git**, confirm the **Production Branch** is `main`.

**If the name `saracodes` is taken**, Vercel assigns a different address (for example
`saracodes-abc123.vercel.app`, shown in the project's **Domains** tab). Then update
`content.brand.siteUrl` in `src/data/content.ts` to that exact address, run `npm run og`, and
merge the change through a small pull request so canonical tags, the sitemap and the OG image use
the right address.

Tip: if the Vercel Toolbar on preview deployments is blocked by the Content-Security-Policy,
disable it in **Settings → General → Vercel Toolbar**, or allow `https://vercel.live` in the CSP.

---

## 6. Phase 2: connect your custom domain (saramahran.com or saracodes.net) later

Choose your custom domain (saramahran.com or saracodes.net); `<domain>` below means that choice.

1. **Buy your custom domain on GoDaddy.**
2. In Vercel, open the project → **Settings → Domains** and add **both** `<domain>` and
   `www.<domain>`.
3. For `www.<domain>`, choose **Redirect to `<domain>`** (permanent, 308), so the root
   domain is the one real address.
4. Vercel then shows the DNS records to create. In GoDaddy, go to **My Products → saracodes.net →
   DNS → DNS Records** and add exactly the values Vercel shows. They typically look like this:

   | Type  | Name  | Value (use what Vercel shows) | TTL    |
   | ----- | ----- | ----------------------------- | ------ |
   | A     | `@`   | `76.76.21.21`                 | 1 hour |
   | CNAME | `www` | `cname.vercel-dns.com`        | 1 hour |
   - GoDaddy usually has a default `A @` record pointing to its "Parked" page, and a `CNAME www`
     pointing to `@`. **Edit those two records** to the Vercel values (or delete only those two
     and add the new ones). Do not add a second `A @` record next to the parked one.
   - Newer Vercel projects may show a different, project-specific IP or CNAME target. Always copy
     what the Vercel Domains screen displays.

5. Wait for Vercel to show both domains as **Valid Configuration** (minutes, sometimes up to a few
   hours). HTTPS certificates are issued automatically.
6. Open a small pull request that changes `content.brand.siteUrl` to `https://<domain>` and
   `content.brand.domain` to your chosen domain, runs
   `npm run og`, and commits the regenerated `public/og-image.png`. Merge it into `main`.

---

## 7. Phase 3: email for your custom domain (saramahran.com or saracodes.net) with Zoho Mail

1. Set up Zoho Mail for `<domain>` and create the mailbox `sara@<domain>`. Zoho will ask
   you to add **MX**, **SPF (TXT)**, **DKIM (TXT)** and a **verification (TXT)** record in GoDaddy.
2. Once mail works, open a small pull request that changes `content.brand.email` to
   `sara@<domain>`, and merge it into `main`.

> **Warning: do NOT delete or change the MX, SPF, DKIM or any other TXT records in GoDaddy.**
> They are used by Zoho Mail. Removing or editing them will stop email from being delivered or
> cause it to land in spam. The website only needs the `A @` and `CNAME www` records from Phase
> 2; leave every other record alone.

---

## Project structure

```
src/
  data/        content.ts (all copy), types.ts, commands.ts
  sections/    page sections (Hero, About, Mentoring, Services, ...)
  components/  reusable UI, dialogs/ (code-split)
  hooks/  lib/ helpers, styles/globals.css (tokens, print styles)
public/        static files (certificates, icons, OG image, theme-init.js)
brand/         source brand files processed by `npm run brand`
scripts/       brand pipeline and OG image generator
vite.config.ts SEO tags, robots.txt, sitemap.xml, 404 page, missing-file warnings
vercel.json    cache and security headers
```

See `CLAUDE.md` for the standing rules and design system.
