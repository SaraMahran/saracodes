import { existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { content } from './src/data/content';

const publicDir = fileURLToPath(new URL('./public/', import.meta.url));

/**
 * Warns (never fails) when files that content links to are missing from public/, such as the
 * CV or certificate PDFs. Add them to brand/ and run `npm run brand`.
 */
function checkPublicFiles(): Plugin {
  const isPublicPath = (path: string | undefined): path is string =>
    typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');

  const files = [
    content.brand.cvPath,
    ...content.certifications.flatMap((certification) => [
      certification.fileUrl,
      certification.image,
    ]),
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

export default defineConfig({
  plugins: [react(), checkPublicFiles()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
