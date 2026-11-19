// Draws an encoded QR matrix as SVG (preview and SVG export) or onto a canvas
// (PNG, JPEG, WEBP). Both use the same geometry, in modules.
import type { QrMatrix } from './encoder';

export type LogoSize = 'S' | 'M' | 'L';
/** Logo edge as a share of the code's edge (quiet zone excluded). */
export const LOGO_SHARE: Record<LogoSize, number> = { S: 0.16, M: 0.22, L: 0.28 };

export interface Logo {
  /** data: URL, so it embeds in the SVG and survives offline. */
  src: string;
  img: HTMLImageElement;
  name: string;
}

export interface Look {
  /** Edge of the whole image in px, quiet zone and border included. */
  px: number;
  dark: string;
  light: string;
  border: boolean;
  logo: Logo | null;
  logoSize: LogoSize;
}

export interface Geometry {
  /** Modules across the whole image. */
  total: number;
  /** Offset of the code from the image edge, in modules. */
  offset: number;
  /** Cleared square for the logo, in modules from the image edge, or null. */
  hole: { x: number; size: number } | null;
}

export function geometry(qr: QrMatrix, look: Look): Geometry {
  const borderW = look.border ? 1 : 0;
  const offset = qr.margin + borderW;
  const total = qr.size + 2 * offset;
  let hole: Geometry['hole'] = null;
  if (look.logo) {
    let size = Math.round(qr.size * LOGO_SHARE[look.logoSize]);
    if ((qr.size - size) % 2) size += 1; // keep it centred on whole modules
    hole = { x: offset + (qr.size - size) / 2, size };
  }
  return { total, offset, hole };
}

/** Logo box inside the hole, keeping the logo's aspect ratio, with half a module of air. */
function logoBox(g: Geometry, logo: Logo) {
  const h = g.hole!;
  const inner = h.size - 1;
  const iw = logo.img.naturalWidth || 1;
  const ih = logo.img.naturalHeight || 1;
  const k = Math.min(inner / iw, inner / ih);
  const w = iw * k;
  const hh = ih * k;
  return { x: h.x + (h.size - w) / 2, y: h.x + (h.size - hh) / 2, w, h: hh };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function toSvg(qr: QrMatrix, look: Look): string {
  const g = geometry(qr, look);
  const T = g.total;
  const parts = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${T} ${T}" width="${look.px}" height="${look.px}" shape-rendering="crispEdges">`,
    `<rect width="${T}" height="${T}" fill="${esc(look.light)}"/>`,
  ];
  if (look.border) {
    parts.push(`<path fill="${esc(look.dark)}" fill-rule="evenodd" d="M0 0H${T}V${T}H0zM1 1V${T - 1}H${T - 1}V1z"/>`);
  }
  parts.push(`<path fill="${esc(look.dark)}" d="${qr.path}"/>`);
  if (g.hole && look.logo) {
    const b = logoBox(g, look.logo);
    parts.push(`<rect x="${g.hole.x}" y="${g.hole.x}" width="${g.hole.size}" height="${g.hole.size}" fill="${esc(look.light)}"/>`);
    parts.push(
      `<image href="${esc(look.logo.src)}" x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" preserveAspectRatio="xMidYMid meet" shape-rendering="auto"/>`,
    );
  }
  parts.push('</svg>');
  return parts.join('');
}

export function toCanvas(qr: QrMatrix, look: Look): HTMLCanvasElement {
  const g = geometry(qr, look);
  const c = document.createElement('canvas');
  c.width = c.height = look.px;
  const ctx = c.getContext('2d')!;
  const s = look.px / g.total;
  // Snap module edges to whole pixels so neighbours never leave hairline gaps.
  const at = (m: number) => Math.round(m * s);
  const box = (x0: number, y0: number, x1: number, y1: number) => ctx.fillRect(at(x0), at(y0), at(x1) - at(x0), at(y1) - at(y0));

  ctx.fillStyle = look.light;
  ctx.fillRect(0, 0, look.px, look.px);
  ctx.fillStyle = look.dark;
  if (look.border) {
    const T = g.total;
    box(0, 0, T, 1);
    box(0, T - 1, T, T);
    box(0, 1, 1, T - 1);
    box(T - 1, 1, T, T - 1);
  }
  const n = qr.size;
  for (let y = 0; y < n; y++) {
    let x = 0;
    while (x < n) {
      if (qr.modules[y * n + x]) {
        const start = x;
        while (x < n && qr.modules[y * n + x]) x++;
        box(g.offset + start, g.offset + y, g.offset + x, g.offset + y + 1);
      } else x++;
    }
  }
  if (g.hole && look.logo) {
    ctx.fillStyle = look.light;
    box(g.hole.x, g.hole.x, g.hole.x + g.hole.size, g.hole.x + g.hole.size);
    const b = logoBox(g, look.logo);
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(look.logo.img, b.x * s, b.y * s, b.w * s, b.h * s);
  }
  return c;
}

export type RasterFormat = 'png' | 'jpeg' | 'webp';
export type Format = RasterFormat | 'svg';
export const FORMATS: Format[] = ['png', 'jpeg', 'webp', 'svg'];

export function toBlob(qr: QrMatrix, look: Look, format: Format): Promise<Blob> {
  if (format === 'svg') return Promise.resolve(new Blob([toSvg(qr, look)], { type: 'image/svg+xml' }));
  const canvas = toCanvas(qr, look);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('encode'))), `image/${format}`, 0.92),
  );
}

// ── Contrast ────────────────────────────────────────────────────────────────

function luminance(hex: string): number {
  const v = parseHex(hex);
  if (!v) return 0;
  const [r, g, b] = v.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  let h = m[1];
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function normaliseHex(hex: string): string | null {
  const v = parseHex(hex);
  return v ? '#' + v.map((c) => c.toString(16).padStart(2, '0')).join('') : null;
}

export type ScanVerdict = 'good' | 'weak' | 'bad' | 'inverted';

export function contrast(dark: string, light: string): { ratio: number; verdict: ScanVerdict } {
  const ld = luminance(dark);
  const ll = luminance(light);
  const ratio = (Math.max(ld, ll) + 0.05) / (Math.min(ld, ll) + 0.05);
  // Most phone scanners expect dark modules on a light ground.
  const verdict: ScanVerdict = ld > ll && ratio >= 1.5 ? 'inverted' : ratio >= 4.5 ? 'good' : ratio >= 3 ? 'weak' : 'bad';
  return { ratio, verdict };
}
