/* Regenerates public/og.png. Run from the repo root: node designs/card-workspace-icon/handoff/make-og.mjs
 *
 * Needs Petrona and Archivo installed as system fonts — sharp rasterises SVG
 * text through fontconfig, so a webfont @import would be ignored. Grab the TTFs
 * from Google Fonts into ~/.local/share/fonts and run `fc-cache -f`.
 *
 * Colours are the light-mode tokens from designs/card-workspace-landing/tokens-v2.css,
 * converted from oklch to sRGB. */

import sharp from 'sharp';

const W = 1200;
const H = 630;

const CANVAS = '#f4f5f7'; // --cw-canvas    oklch(0.971 0.002 250)
const INK = '#121417'; // --cw-ink       oklch(0.19  0.007 258)
const INK_SOFT = '#505357'; // --cw-ink-soft  oklch(0.44  0.008 258)
const INK_FAINT = '#888b90'; // --cw-ink-faint oklch(0.635 0.008 258)
const ACCENT = '#3c4f64'; // --cw-accent     oklch(0.42  0.042 252)
const ACCENT_INK = '#22374e'; // --cw-accent-ink oklch(0.33  0.05  252)

const mark = (x, y, s) => `
  <g transform="translate(${x} ${y}) scale(${s / 128})">
    <rect width="128" height="128" rx="30" fill="url(#g)"/>
    <g fill="#ffffff">
      <rect x="24" y="28" width="8" height="72" rx="4" opacity="0.55"/>
      <rect x="40" y="24" width="52" height="36" rx="10" opacity="0.8"/>
      <rect x="52" y="68" width="52" height="36" rx="10"/>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${ACCENT}"/><stop offset="1" stop-color="${ACCENT_INK}"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="${CANVAS}"/>
  <rect x="0" y="0" width="${W}" height="6" fill="${ACCENT}"/>

  <text x="96" y="228" fill="${INK_FAINT}" font-family="Archivo"
        font-size="22" font-weight="500" letter-spacing="3.5">OBSIDIAN PLUGIN</text>

  ${mark(96, 264, 96)}

  <text x="228" y="344" fill="${INK}" font-family="Petrona"
        font-size="86" font-weight="500" letter-spacing="-2">Card Workspace</text>

  <text x="96" y="452" fill="${INK_SOFT}" font-family="Archivo"
        font-size="30" font-weight="400">Turn your Obsidian notes into a flexible, visual card workspace.</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('wrote public/og.png');
