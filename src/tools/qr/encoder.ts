// Loads the Rust QR encoder (qr.wasm, built by `npm run build:wasm`) and wraps its raw ABI.
import wasmUrl from './qr.wasm?url';

export type Ecc = 'L' | 'M' | 'Q' | 'H';
export const ECC_LEVELS: Ecc[] = ['L', 'M', 'Q', 'H'];
/** Share of the code that may be damaged or covered and still scan. */
export const ECC_RECOVERY: Record<Ecc, number> = { L: 7, M: 15, Q: 25, H: 30 };

interface Exports {
  memory: WebAssembly.Memory;
  alloc(len: number): number;
  dealloc(ptr: number, len: number): void;
  encode(ptr: number, len: number, ecc: number): number;
  modules_ptr(): number;
  version(): number;
  svg_path(margin: number): number;
  svg_ptr(): number;
  capacity(ecc: number): number;
}

export interface QrMatrix {
  /** Modules per side, without margin. */
  size: number;
  version: number;
  /** size*size entries, 1 = dark. */
  modules: Uint8Array;
  /** Quiet zone the path was built with, in modules. */
  margin: number;
  /** SVG path of the dark modules, offset by `margin` modules. */
  path: string;
}

export type EncodeResult =
  | { ok: true; qr: QrMatrix }
  | { ok: false; reason: 'empty' | 'too-long'; bytes: number; capacity: number };

let ready: Promise<Exports> | null = null;

async function instantiate(): Promise<Exports> {
  const res = await fetch(wasmUrl);
  // Some servers (and Local's nginx) send .wasm without application/wasm; fall back.
  if (res.headers.get('content-type')?.startsWith('application/wasm')) {
    try {
      return (await WebAssembly.instantiateStreaming(res.clone(), {})).instance.exports as unknown as Exports;
    } catch {
      /* fall through */
    }
  }
  const { instance } = await WebAssembly.instantiate(await res.arrayBuffer(), {});
  return instance.exports as unknown as Exports;
}

export function loadEncoder(): Promise<Encoder> {
  ready ??= instantiate();
  return ready.then((x) => new Encoder(x));
}

const utf8 = new TextEncoder();
const ascii = new TextDecoder();

export class Encoder {
  constructor(private x: Exports) {}

  encode(text: string, ecc: Ecc, margin: number): EncodeResult {
    const level = ECC_LEVELS.indexOf(ecc);
    const bytes = utf8.encode(text);
    const capacity = this.x.capacity(level);
    if (bytes.length === 0) return { ok: false, reason: 'empty', bytes: 0, capacity };
    const ptr = this.x.alloc(bytes.length);
    new Uint8Array(this.x.memory.buffer, ptr, bytes.length).set(bytes);
    const n = this.x.encode(ptr, bytes.length, level);
    this.x.dealloc(ptr, bytes.length);
    if (n < 0) return { ok: false, reason: n === -1 ? 'too-long' : 'empty', bytes: bytes.length, capacity };
    // Copy out: the next call overwrites the buffers in wasm memory.
    const modules = new Uint8Array(this.x.memory.buffer, this.x.modules_ptr(), n * n).slice();
    const len = this.x.svg_path(margin);
    const path = ascii.decode(new Uint8Array(this.x.memory.buffer, this.x.svg_ptr(), len));
    return { ok: true, qr: { size: n, version: this.x.version(), modules, margin, path } };
  }
}
