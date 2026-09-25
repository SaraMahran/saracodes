import { motion } from 'framer-motion';
import { site } from '@/data/site';

// Resolves to the logo URL once src/assets/logo.svg is in place (see `npm run brand`).
const logoUrl = Object.values(
  import.meta.glob<string>('./assets/logo.svg', { eager: true, query: '?url', import: 'default' }),
)[0];

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
            alt={site.logoAlt}
            width={240}
            height={240}
            className="h-auto w-48 drop-shadow-[0_0_32px_rgb(var(--color-tertiary)/0.35)] sm:w-60"
          />
        ) : (
          <span className="font-heading text-5xl font-bold text-text">{site.brand}</span>
        )}
        <h1 className="text-brand-gradient">{site.comingSoon}</h1>
        <p className="section-label">{site.domain}</p>
      </motion.div>
    </main>
  );
}
