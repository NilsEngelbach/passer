// Build-time offline support without workbox:
//  1. one real HTML page per tool (dist/<slug>/index.html), so /qr/ works on any static host;
//  2. dist/sw.js: the service worker template with the precache list and a content hash
//     as cache version, so every deploy that changes a file installs a fresh cache.
import type { Plugin } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { TOOLS, PRODUCT } from '../src/tools/catalog';

const NOT_PRECACHED = new Set(['sw.js', 'version.txt', '.htaccess']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name: string) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

export function offline(): Plugin {
  let outDir = 'dist';
  return {
    name: 'passer-offline',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir;
    },
    closeBundle() {
      const index = readFileSync(join(outDir, 'index.html'), 'utf8');
      for (const t of TOOLS) {
        const page = index
          .replace(/<title>[^<]*<\/title>/, `<title>${t.name.en} · ${PRODUCT.name}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${t.summary.en}$2`);
        mkdirSync(join(outDir, t.slug), { recursive: true });
        writeFileSync(join(outDir, t.slug, 'index.html'), page);
      }

      const files = walk(outDir)
        .map((p) => relative(outDir, p).split(sep).join('/'))
        .filter((f) => !NOT_PRECACHED.has(f) && !f.startsWith('.'))
        .sort();
      const hash = createHash('sha256');
      for (const f of files) hash.update(f).update(readFileSync(join(outDir, f)));
      const version = hash.digest('hex').slice(0, 12);

      // Pages are cached under their folder URL (/qr/), everything else under its path.
      const urls = files.map((f) => '/' + f.replace(/(^|\/)index\.html$/, '$1'));
      const template = readFileSync(new URL('./sw-template.js', import.meta.url), 'utf8');
      writeFileSync(
        join(outDir, 'sw.js'),
        template
          .replace('__VERSION__', version)
          .replace('__PRECACHE__', JSON.stringify(urls, null, 0)),
      );
      console.log(`sw.js: ${urls.length} files precached, cache ${version}`);
    },
  };
}
