import { copyFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { isFilled } from './src/lib/todo';

export default defineConfig(async ({ mode }): Promise<UserConfig> => {
  const variant =
    process.env.VITE_SITE_VARIANT ??
    loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_VARIANT ??
    'main';
  if (!['main', 'upwork'].includes(variant))
    throw new Error('VITE_SITE_VARIANT must be main or upwork');
  process.env.VITE_SITE_VARIANT = variant;
  const { content, resumePath } = await import('./src/data/content');
  const { isUpwork } = await import('./src/lib/variant');

  const publicDir = fileURLToPath(new URL('./public/', import.meta.url));

  /** The one configurable site address (content.brand.siteUrl), without a trailing slash. */
  const siteUrl = content.brand.siteUrl.replace(/\/+$/, '');

  const escapeHtml = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

  /**
   * Head tags generated from content: title, description, canonical, Open Graph, Twitter card
   * and JSON-LD (ProfessionalService + Person), so SEO copy lives in src/data/content.ts.
   */
  function seoTags(): Plugin {
    const { brand, seo, services } = content;
    const ogImage = `${siteUrl}${seo.ogImage}`;
    const sameAs = Object.values(brand.socials).filter(isFilled);

    const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
      tag: 'meta',
      attrs,
      injectTo: 'head',
    });

    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'ProfessionalService',
          '@id': `${siteUrl}/#business`,
          name: brand.name,
          url: siteUrl,
          ...(!isUpwork && { email: brand.email }),
          description: seo.description,
          image: ogImage,
          logo: `${siteUrl}/icon-512.png`,
          areaServed: seo.areaServed,
          founder: { '@id': `${siteUrl}/#person` },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Services',
            itemListElement: services.map((service) => ({
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: service.title,
                description: service.description,
              },
            })),
          },
        },
        {
          '@type': 'Person',
          '@id': `${siteUrl}/#person`,
          name: brand.owner,
          jobTitle: seo.jobTitle,
          url: siteUrl,
          ...(!isUpwork && { email: brand.email }),
          worksFor: { '@id': `${siteUrl}/#business` },
          ...(sameAs.length > 0 && { sameAs }),
        },
      ],
    };

    return {
      name: 'saracodes:seo-tags',
      transformIndexHtml(html) {
        const tags: HtmlTagDescriptor[] = [
          ...(isUpwork ? [meta({ name: 'robots', content: 'noindex, nofollow' })] : []),
          meta({ name: 'description', content: seo.description }),
          meta({ name: 'author', content: brand.owner }),
          { tag: 'link', attrs: { rel: 'canonical', href: `${siteUrl}/` }, injectTo: 'head' },
          meta({ property: 'og:type', content: 'website' }),
          meta({ property: 'og:site_name', content: brand.name }),
          meta({ property: 'og:locale', content: seo.locale }),
          meta({ property: 'og:title', content: seo.title }),
          meta({ property: 'og:description', content: seo.description }),
          meta({ property: 'og:url', content: `${siteUrl}/` }),
          meta({ property: 'og:image', content: ogImage }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ property: 'og:image:alt', content: seo.ogImageAlt }),
          meta({ name: 'twitter:card', content: 'summary_large_image' }),
          meta({ name: 'twitter:title', content: seo.title }),
          meta({ name: 'twitter:description', content: seo.description }),
          meta({ name: 'twitter:image', content: ogImage }),
          meta({ name: 'twitter:image:alt', content: seo.ogImageAlt }),
          {
            tag: 'script',
            attrs: { type: 'application/ld+json' },
            // Escape "<" so the JSON can never close the script tag.
            children: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
            injectTo: 'head',
          },
        ];
        return {
          html: html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`),
          tags,
        };
      },
    };
  }

  /**
   * robots.txt and sitemap.xml, generated from content.brand.siteUrl so changing the site address
   * updates them too. Served by the dev server and emitted into the build output.
   */
  function siteFiles(): Plugin {
    const today = new Date().toISOString().slice(0, 10);
    const files: Record<string, { type: string; body: string }> = {
      'robots.txt': {
        type: 'text/plain; charset=utf-8',
        body: `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      },
      'sitemap.xml': {
        type: 'application/xml; charset=utf-8',
        body: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          '  <url>',
          `    <loc>${siteUrl}/</loc>`,
          `    <lastmod>${today}</lastmod>`,
          '    <changefreq>monthly</changefreq>',
          '    <priority>1.0</priority>',
          '  </url>',
          '</urlset>',
          '',
        ].join('\n'),
      },
    };
    if (isUpwork) {
      files['robots.txt'].body = 'User-agent: *\nDisallow: /\n';
      delete files['sitemap.xml'];
    }

    return {
      name: 'saracodes:site-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const file = files[(req.url ?? '').split('?')[0].replace(/^\//, '')];
          if (!file) return next();
          res.setHeader('Content-Type', file.type);
          res.end(file.body);
        });
      },
      generateBundle() {
        for (const [fileName, file] of Object.entries(files)) {
          this.emitFile({ type: 'asset', fileName, source: file.body });
        }
      },
    };
  }

  /**
   * Preloads the latin subsets of the fonts used above the fold (Poppins 700 for the hero name,
   * Poppins 600 for headings, Inter 400 for body text) so they arrive with the HTML.
   */
  function preloadFonts(): Plugin {
    const critical = [
      /poppins-latin-700-normal/,
      /poppins-latin-600-normal/,
      /inter-latin-400-normal/,
    ];
    return {
      name: 'saracodes:preload-fonts',
      apply: 'build',
      transformIndexHtml: {
        order: 'post',
        handler(_html, ctx) {
          if (!ctx.bundle) return [];
          return Object.keys(ctx.bundle)
            .filter((file) => file.endsWith('.woff2') && critical.some((re) => re.test(file)))
            .map((file) => ({
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: `/${file}`,
                as: 'font',
                type: 'font/woff2',
                crossorigin: 'anonymous',
              },
              injectTo: 'head-prepend' as const,
            }));
        },
      },
    };
  }

  /**
   * Copies the built index.html to 404.html. Static hosts (Vercel, Netlify, GitHub Pages) serve it
   * for unknown routes, and the app renders its 404 page based on the path.
   */
  function notFoundPage(): Plugin {
    let outDir = 'dist';
    return {
      name: 'saracodes:404-page',
      apply: 'build',
      configResolved(config) {
        outDir = config.build.outDir;
      },
      writeBundle() {
        copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
      },
    };
  }

  /**
   * Warns (never fails) when files that content links to are missing from public/, such as the
   * CV, certificate PDFs, project images or the OG image. Add them to brand/ and run
   * `npm run brand`.
   */
  function checkPublicFiles(): Plugin {
    const isPublicPath = (path: string | undefined): path is string =>
      typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

    const files = [
      content.brand.cvPath,
      content.seo.ogImage,
      ...content.certifications.flatMap((certification) => [
        certification.fileUrl,
        certification.image,
      ]),
      ...content.projects.flatMap((project) => (project.image ? [project.image] : [])),
    ].filter(isPublicPath);

    return {
      name: 'saracodes:check-public-files',
      apply: 'build',
      buildStart() {
        for (const file of files) {
          if (!existsSync(publicDir + file.slice(1))) {
            this.warn(`Missing public file ${file}: links to it will 404 until it is added.`);
          }
        }
      },
    };
  }

  return {
    // Copy public assets explicitly for Upwork, so the private resume never enters dist.
    publicDir: isUpwork ? false : publicDir,
    define: { __SITE_VARIANT__: JSON.stringify(variant) },
    plugins: [
      react(),
      seoTags(),
      siteFiles(),
      preloadFonts(),
      notFoundPage(),
      checkPublicFiles(),
      ...(isUpwork ? [upworkPublicFiles()] : []),
    ],
    resolve: {
      alias: {
        ...(isUpwork && {
          '@/lib/contactVariant': fileURLToPath(
            new URL('./src/lib/upworkContactVariant.ts', import.meta.url),
          ),
        }),
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  };

  /** Serve and emit public assets except the resume in the Upwork variant. */
  function upworkPublicFiles(): Plugin {
    const files = readdirSync(publicDir, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => join(entry.parentPath, entry.name))
      .filter((file) => file !== join(publicDir, resumePath.slice(1)));
    const assets = new Map(
      files.map((file) => [relative(publicDir, file).replace(/\\/g, '/'), file]),
    );
    return {
      name: 'saracodes:upwork-public-files',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const path = decodeURIComponent((req.url ?? '').split('?')[0]);
          if (path === resumePath) {
            res.statusCode = 404;
            return res.end();
          }
          const file = assets.get(path.replace(/^\//, ''));
          if (!file) return next();
          const types: Record<string, string> = {
            png: 'image/png',
            svg: 'image/svg+xml',
            pdf: 'application/pdf',
            js: 'text/javascript',
            webp: 'image/webp',
          };
          res.setHeader(
            'Content-Type',
            types[file.split('.').pop() ?? ''] ?? 'application/octet-stream',
          );
          res.end(readFileSync(file));
        });
      },
      generateBundle() {
        for (const [fileName, file] of assets) {
          this.emitFile({ type: 'asset', fileName, source: readFileSync(file) });
        }
      },
    };
  }
});
