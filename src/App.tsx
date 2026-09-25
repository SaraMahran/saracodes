import { motion } from 'framer-motion';
import { content } from '@/data/content';
import { assetUrl } from '@/lib/assets';

const { brand, ui } = content;
const logoUrl = assetUrl(brand.logoPath);

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-bg px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-8"
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={brand.logoAlt}
            width={240}
            height={240}
            className="h-auto w-48 drop-shadow-[0_0_32px_rgb(var(--color-tertiary)/0.35)] sm:w-60"
          />
        ) : (
          <span className="font-heading text-5xl font-bold text-text">{brand.name}</span>
        )}
        <h1 className="text-brand-gradient">{ui.comingSoon}</h1>
        <p className="section-label">{brand.domain}</p>
      </motion.div>
    </main>
  );
}
