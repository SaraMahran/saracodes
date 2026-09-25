/**
 * Brand asset pipeline. Safe to run repeatedly (`npm run brand`, which then runs `npm run og`).
 * 1. Moves brand/ source files into src/assets and public/ (logo artwork is moved, never altered).
 * 2. Generates favicon.svg and PNG icons in public/ from src/assets/logo-mark.svg.
 * 3. Converts project screenshots in brand/projects/ (png, jpg, webp) to optimized WebP in
 *    public/projects/. Name each file after the project id, e.g. brand/projects/wanas.png.
 */
import {
  existsSync,
  mkdirSync,
  renameSync,
  copyFileSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import { dirname, extname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => resolve(root, ...parts);

// 1. Move brand files into place.
const moves = [
  ['brand/saracodes-logo.svg', 'src/assets/logo.svg'],
  ['brand/saracodes-mark.svg', 'src/assets/logo-mark.svg'],
  ['brand/Sara_Ali_Mahran_CV.pdf', 'public/Sara_Ali_Mahran_CV.pdf'],
  ['brand/McKinsey_Forward_Program.pdf', 'public/certificates/mckinsey-forward.pdf'],
];

for (const [from, to] of moves) {
  if (!existsSync(p(from))) {
    console.log(`skip   ${from} (not found)`);
    continue;
  }
  mkdirSync(dirname(p(to)), { recursive: true });
  renameSync(p(from), p(to));
  console.log(`moved  ${from} -> ${to}`);
}

// 2. Favicons and app icons from the logo mark.
const mark = p('src/assets/logo-mark.svg');
if (existsSync(mark)) {
  copyFileSync(mark, p('public/favicon.svg'));
  console.log('wrote  public/favicon.svg');

  const svg = readFileSync(mark);
  const { width: markWidth = 512 } = await sharp(svg).metadata();
  const icons = [
    ['public/favicon-32x32.png', 32],
    ['public/apple-touch-icon.png', 180],
    ['public/icon-512.png', 512],
  ];

  for (const [out, size] of icons) {
    // Rasterize at 2x the target size (relative to the SVG's own width), then downscale.
    const density = Math.max(72, Math.ceil((72 * size * 2) / markWidth));
    await sharp(svg, { density })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(p(out));
    console.log(`wrote  ${out} (${size}x${size})`);
  }
} else {
  console.log('skip   icon generation (src/assets/logo-mark.svg not found)');
}

// 3. Project screenshots -> WebP (max 1600px wide, 16:10 friendly, quality 80).
const screenshotsDir = p('brand/projects');
const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const screenshots = existsSync(screenshotsDir)
  ? readdirSync(screenshotsDir).filter((file) => imageExtensions.has(extname(file).toLowerCase()))
  : [];

if (screenshots.length === 0) {
  console.log('skip   project images (no files in brand/projects/)');
} else {
  mkdirSync(p('public/projects'), { recursive: true });
  for (const file of screenshots) {
    const out = `public/projects/${basename(file, extname(file))}.webp`;
    await sharp(resolve(screenshotsDir, file))
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(p(out));
    console.log(`wrote  ${out}`);
  }
}
