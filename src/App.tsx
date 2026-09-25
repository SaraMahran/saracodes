import { Suspense, useCallback, useEffect, useState, type ComponentType } from 'react';
import { Background } from '@/components/Background';
import { ContactFormProvider } from '@/components/ContactFormProvider';
import { CursorGlow } from '@/components/CursorGlow';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { Toaster } from '@/components/Toast';
import { content } from '@/data/content';
import type { SectionId } from '@/data/types';
import { usePrefetchOnIdle } from '@/hooks/usePrefetchOnIdle';
import { LazyCommandPalette, loadCommandPalette } from '@/lib/lazy';
import { About } from '@/sections/About';
import { Certifications } from '@/sections/Certifications';
import { Contact } from '@/sections/Contact';
import { Experience } from '@/sections/Experience';
import { Hero } from '@/sections/Hero';
import { Mentoring } from '@/sections/Mentoring';
import { Projects } from '@/sections/Projects';
import { Services } from '@/sections/Services';

const { sections, ui } = content;

const sectionComponents: Record<SectionId, ComponentType> = {
  hero: Hero,
  about: About,
  services: Services,
  projects: Projects,
  experience: Experience,
  mentoring: Mentoring,
  certifications: Certifications,
  contact: Contact,
};

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  // The palette is code-split: it mounts on first open and then stays mounted for animations.
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  usePrefetchOnIdle(loadCommandPalette);

  const setPalette = useCallback((open: boolean) => {
    if (open) setPaletteLoaded(true);
    setPaletteOpen(open);
  }, []);

  // Ctrl K / Cmd K toggles the palette. Lives here so it works before the palette has loaded.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setPaletteLoaded(true);
        setPaletteOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <ContactFormProvider>
      <div className="relative isolate min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="no-print sr-only no-underline focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-secondary focus:px-4 focus:py-2 focus:text-on-accent"
        >
          {ui.skipToContent}
        </a>
        <ScrollProgress />
        <Background />
        <CursorGlow />
        <Navbar />

        <main id="main" tabIndex={-1} className="focus:outline-none">
          {sections.map((section) => {
            const Component = sectionComponents[section.id];
            return <Component key={section.id} />;
          })}
        </main>

        <Footer />
        {paletteLoaded && (
          <Suspense fallback={null}>
            <LazyCommandPalette open={paletteOpen} onOpenChange={setPalette} />
          </Suspense>
        )}
        <Toaster />
      </div>
    </ContactFormProvider>
  );
}
