import { defineConfig } from 'vite';
import { offline } from './build/pwa-plugin';

export default defineConfig({
  build: {
    target: 'es2022',
    // The .wasm must stay a separate file (streamed and cached on its own).
    assetsInlineLimit: 0,
  },
  plugins: [offline()],
});
