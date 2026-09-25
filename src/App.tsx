import { useState, type ComponentType } from 'react';
import { Background } from '@/components/Background';
import { CommandPalette } from '@/components/CommandPalette';
import { ContactFormProvider } from '@/components/ContactFormProvider';
import { CursorGlow } from '@/components/CursorGlow';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { content } from '@/data/content';
import type { SectionId } from '@/data/types';
import { About } from '@/sections/About';
import { Hero } from '@/sections/Hero';
import { PlaceholderSection } from '@/sections/PlaceholderSection';
import { Services } from '@/sections/Services';

const { sections, ui } = content;

/** Built sections; any section not listed here renders a placeholder. */
const sectionComponents: Partial<Record<SectionId, ComponentType>> = {
  hero: Hero,
  about: About,
  services: Services,
};

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <ContactFormProvider>
      <div className="relative isolate min-h-screen overflow-x-clip">
        <a
          href="#main"
          className="sr-only no-underline focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-secondary focus:px-4 focus:py-2 focus:text-on-accent"
        >
          {ui.skipToContent}
        </a>
        <ScrollProgress />
        <Background />
        <CursorGlow />
        <Navbar onOpenPalette={() => setPaletteOpen(true)} />

        <main id="main" tabIndex={-1} className="focus:outline-none">
          {sections.map((section) => {
            const Component = sectionComponents[section.id];
            return Component ? (
              <Component key={section.id} />
            ) : (
              <PlaceholderSection key={section.id} id={section.id} />
            );
          })}
        </main>

        <Footer />
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </ContactFormProvider>
  );
}
