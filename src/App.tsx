import { useState } from 'react';
import { Background } from '@/components/Background';
import { CommandPalette } from '@/components/CommandPalette';
import { CursorGlow } from '@/components/CursorGlow';
import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/Navbar';
import { ScrollProgress } from '@/components/ScrollProgress';
import { content } from '@/data/content';
import { Hero } from '@/sections/Hero';
import { PlaceholderSection } from '@/sections/PlaceholderSection';

const { sections, ui } = content;

export default function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div className="relative isolate min-h-screen">
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
        <Hero />
        {sections
          .filter((section) => section.id !== 'hero')
          .map((section) => (
            <PlaceholderSection key={section.id} id={section.id} />
          ))}
      </main>

      <Footer />
      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </div>
  );
}
