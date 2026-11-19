// Renders the app icons from one authored SVG: a registration target on press black.
//   npm run icons
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const icon = (pad, radius) => {
  const s = 512 - 2 * pad;
  const k = s / 24;
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${radius}" fill="#1a1a1a"/>
  <circle cx="256" cy="256" r="${6.5 * k}" fill="none" stroke="#e5007e" stroke-width="${1.2 * k}" transform="translate(${0.5 * k} ${-0.4 * k})"/>
  <g transform="translate(${pad} ${pad}) scale(${k})" fill="none" stroke="#ffffff" stroke-width="1.2">
    <circle cx="12" cy="12" r="6.5"/>
    <path d="M12 1.5v21M1.5 12h21"/>
  </g>
  <circle cx="256" cy="256" r="${2.6 * k}" fill="#ffffff"/>
</svg>`;
};

mkdirSync('public/pwa', { recursive: true });
const jobs = [
  ['public/pwa/icon-192.png', 192, icon(96, 96)],
  ['public/pwa/icon-512.png', 512, icon(96, 96)],
  ['public/pwa/maskable-512.png', 512, icon(150, 0)],
  ['public/apple-touch-icon.png', 180, icon(110, 0)],
];
for (const [file, size, svg] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(file);
  console.log(file);
}
