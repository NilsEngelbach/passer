// The tool list. Plain data with no DOM imports, so vite.config.ts can read it too
// (it writes one real HTML page per tool, so deep links work on any static server).

export interface ToolEntry {
  /** URL folder: /<slug>/ */
  slug: string;
  name: { en: string; de: string };
  summary: { en: string; de: string };
}

export const TOOLS: ToolEntry[] = [
  {
    slug: 'qr',
    name: { en: 'QR code', de: 'QR-Code' },
    summary: {
      en: 'Turn a link, text, WiFi login or contact card into a QR code. PNG, JPEG, WEBP or SVG.',
      de: 'Link, Text, WLAN-Zugang oder Visitenkarte als QR-Code. PNG, JPEG, WEBP oder SVG.',
    },
  },
];

export const PRODUCT = {
  name: 'Passer',
  tagline: {
    en: 'Small tools that work on your device, even offline.',
    de: 'Kleine Werkzeuge, die auf deinem Gerät laufen, auch offline.',
  },
};
