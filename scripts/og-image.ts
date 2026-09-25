/**
 * Generates public/og-image.png (1200x630) for Open Graph / Twitter cards:
 * dark bg, the full logo centered on the left over a soft brand-gradient glow, and the name,
 * tagline and domain on the right. Text comes from src/data/content.ts.
 *
 * Run with `npm run og` (also runs as part of `npm run brand`). If src/assets/logo.svg is not
 * there yet, a text wordmark is drawn instead; re-run once the logo is added.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { content } from '../src/data/content.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const WIDTH = 1200;
const HEIGHT = 630;
const LOGO_SIZE = 340;
const LOGO_CENTER = { x: 320, y: HEIGHT / 2 };

// Midnight Bloom tokens (dark theme), matching src/styles/globals.css.
const color = {
  bg: '#0B0F14',
  text: '#E6EDF3',
  muted: '#8B98A5',
  primary: '#8BBBFF',
  secondary: '#FF89CA',
  tertiary: '#C8A5FD',
};

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap by character count (good enough for a short tagline). */
function wrap(text: string, maxChars: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(/\s+/)) {
    if (line && `${line} ${word}`.length > maxChars) {
      lines.push(line);
      line = word;
    } else {
      line = line ? `${line} ${word}` : word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

const { brand } = content;
const logoPath = resolve(root, 'src/assets/logo.svg');
const hasLogo = existsSync(logoPath);

const heading = "Poppins, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const mono = "'JetBrains Mono', Consolas, 'Courier New', monospace";
const textX = 620;
const taglineLines = wrap(brand.tagline, 30);

const wordmark = hasLogo
  ? ''
  : `<text x="${LOGO_CENTER.x}" y="${LOGO_CENTER.y + 26}" text-anchor="middle" font-family="${heading}" font-size="76" font-weight="700">
       <tspan fill="${color.secondary}">${escapeXml(brand.wordmark.first)}</tspan><tspan fill="${color.primary}">${escapeXml(brand.wordmark.second)}</tspan>
     </text>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="glow" cx="${LOGO_CENTER.x}" cy="${LOGO_CENTER.y}" r="330" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${color.secondary}" stop-opacity="0.30" />
      <stop offset="0.45" stop-color="${color.tertiary}" stop-opacity="0.16" />
      <stop offset="1" stop-color="${color.primary}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="1020" cy="120" r="360" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${color.primary}" stop-opacity="0.12" />
      <stop offset="1" stop-color="${color.primary}" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="brand" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="${color.secondary}" />
      <stop offset="0.5" stop-color="${color.tertiary}" />
      <stop offset="1" stop-color="${color.primary}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${color.bg}" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)" />
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow2)" />
  <rect x="0" y="${HEIGHT - 6}" width="${WIDTH}" height="6" fill="url(#brand)" opacity="0.9" />
  ${wordmark}
  <text x="${textX}" y="258" font-family="${heading}" font-size="58" font-weight="700" fill="${color.text}">${escapeXml(brand.owner)}</text>
  <rect x="${textX}" y="286" width="96" height="4" rx="2" fill="url(#brand)" />
  ${taglineLines
    .map(
      (line, index) =>
        `<text x="${textX}" y="${346 + index * 42}" font-family="${heading}" font-size="30" font-weight="500" fill="${color.muted}">${escapeXml(line)}</text>`,
    )
    .join('\n  ')}
  <text x="${textX}" y="${346 + taglineLines.length * 42 + 44}" font-family="${mono}" font-size="24" fill="${color.primary}">${escapeXml(brand.domain)}</text>
</svg>`;

const layers: sharp.OverlayOptions[] = [];
if (hasLogo) {
  const logo = await sharp(readFileSync(logoPath), { density: 300 })
    .resize(LOGO_SIZE, LOGO_SIZE, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  layers.push({
    input: logo,
    left: Math.round(LOGO_CENTER.x - LOGO_SIZE / 2),
    top: Math.round(LOGO_CENTER.y - LOGO_SIZE / 2),
  });
}

const out = resolve(root, 'public/og-image.png');
await sharp(Buffer.from(svg)).composite(layers).png({ compressionLevel: 9 }).toFile(out);
console.log(
  `wrote  public/og-image.png (${WIDTH}x${HEIGHT}${hasLogo ? '' : ', text wordmark: logo.svg not found'})`,
);
