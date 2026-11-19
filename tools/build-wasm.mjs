// Builds the Rust QR encoder to WebAssembly and copies it next to its loader.
// The .wasm is committed, so a normal build needs no Rust toolchain.
//   npm run build:wasm      (needs: rustup target add wasm32-unknown-unknown)
import { execFileSync } from 'node:child_process';
import { copyFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const crate = join(root, 'wasm', 'qr');
execFileSync('cargo', ['test', '--release', '--quiet'], { cwd: crate, stdio: 'inherit' });
execFileSync('cargo', ['build', '--release', '--target', 'wasm32-unknown-unknown'], { cwd: crate, stdio: 'inherit' });
const out = join(crate, 'target', 'wasm32-unknown-unknown', 'release', 'qr_core.wasm');
const dest = join(root, 'src', 'tools', 'qr', 'qr.wasm');
copyFileSync(out, dest);
console.log(`qr.wasm: ${statSync(dest).size} bytes`);
