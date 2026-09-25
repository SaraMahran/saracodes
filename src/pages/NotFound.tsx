import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Background } from '@/components/Background';
import { LogoMark, Wordmark } from '@/components/Wordmark';
import { content } from '@/data/content';
import { buttonClasses } from '@/lib/button';

const { brand, notFound } = content;

/** Terminal-style 404 page with the logo mark and a link home. Not indexed by search engines. */
export function NotFound() {
  const path = window.location.pathname;

  useEffect(() => {
    document.title = notFound.title;
    const robots = document.createElement('meta');
    robots.name = 'robots';
    robots.content = 'noindex';
    document.head.appendChild(robots);
    return () => robots.remove();
  }, []);

  return (
    <div className="relative isolate flex min-h-screen flex-col">
      <Background />
      <header className="px-4 py-6 sm:px-6">
        <a href="/" className="inline-flex items-center gap-2.5 rounded-md no-underline">
          <LogoMark />
          <Wordmark />
        </a>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-16 sm:px-6">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-glow">
          <div
            className="flex items-center gap-2 border-b border-border px-4 py-3"
            aria-hidden="true"
          >
            <span className="h-3 w-3 rounded-full bg-secondary" />
            <span className="h-3 w-3 rounded-full bg-tertiary" />
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="ml-3 font-mono text-xs text-muted">{brand.domain}</span>
          </div>

          <div className="p-6 font-mono text-sm leading-relaxed sm:p-8">
            <p className="break-all text-muted">
              <span className="text-primary">{notFound.prompt}</span> {notFound.command}{' '}
              <span className="text-text">{path}</span>
            </p>
            <h1 className="mt-3 font-mono text-2xl font-semibold text-secondary">
              {notFound.error}
            </h1>
            <p className="mt-3 font-sans text-base text-muted">{notFound.hint}</p>
            <p className="mt-6 flex items-center text-muted" aria-hidden="true">
              <span className="text-primary">{notFound.prompt}</span>
              <span className="ml-2 inline-block h-[1.1em] w-[0.55em] bg-primary motion-safe:animate-blink" />
            </p>

            <a href="/" className={buttonClasses('secondary', 'md', 'mt-8 font-sans')}>
              <ArrowLeft size={16} aria-hidden />
              {notFound.homeLink}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
