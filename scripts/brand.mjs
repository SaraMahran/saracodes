/**
 * Brand asset pipeline. Safe to run repeatedly.
 * 1. Moves brand/ source files into src/assets and public/ (logo artwork is moved, never altered).
 * 2. Generates favicon.svg and PNG icons in public/ from src/assets/logo-mark.svg.
 */
import { existsSync, mkdirSync, renameSync, copyFileSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => resolve(root, ...parts);

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

const mark = p('src/assets/logo-mark.svg');
if (!existsSync(mark)) {
  console.log('skip   icon generation (src/assets/logo-mark.svg not found)');
  process.exit(0);
}

copyFileSync(mark, p('public/favicon.svg'));
console.log('wrote  public/favicon.svg');

const svg = readFileSync(mark);
const icons = [
  ['public/favicon-32x32.png', 32],
  ['public/apple-touch-icon.png', 180],
  ['public/icon-512.png', 512],
];

for (const [out, size] of icons) {
  await sharp(svg, { density: Math.max(72, Math.ceil((size / 24) * 72)) })
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(p(out));
  console.log(`wrote  ${out} (${size}x${size})`);
}
