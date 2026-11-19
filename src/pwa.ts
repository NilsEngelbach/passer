// Service worker registration and update state. Production builds only:
// the dev server has no sw.js.
import { useEffect, useState } from 'preact/hooks';

export type PwaState = 'none' | 'preparing' | 'ready' | 'update';

let waiting: ServiceWorker | null = null;
let state: PwaState = 'none';
const listeners = new Set<(s: PwaState) => void>();
const set = (s: PwaState) => {
  state = s;
  listeners.forEach((l) => l(s));
};

export function registerPwa() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  // Service workers need https (or localhost); plain http just skips offline support.
  if (!window.isSecureContext) return;
  let reloading = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (reloading) return;
    reloading = true;
    location.reload();
  });
  navigator.serviceWorker.register('/sw.js').then((reg) => {
    const hadController = !!navigator.serviceWorker.controller;
    set(hadController ? 'ready' : 'preparing');
    const track = (w: ServiceWorker | null) => {
      if (!w) return;
      const check = () => {
        if (w.state !== 'installed') return;
        if (navigator.serviceWorker.controller) {
          waiting = w;
          set('update');
        } else set('ready');
      };
      w.addEventListener('statechange', check);
      check();
    };
    if (reg.waiting && navigator.serviceWorker.controller) {
      waiting = reg.waiting;
      set('update');
    }
    track(reg.installing);
    reg.addEventListener('updatefound', () => track(reg.installing));
    if (!hadController) navigator.serviceWorker.ready.then(() => state === 'preparing' && set('ready'));
    // Look for a new version when the app comes back to the foreground.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') reg.update().catch(() => {});
    });
  });
}

export function applyUpdate() {
  waiting?.postMessage('skip-waiting');
}

export function usePwa(): PwaState {
  const [s, setS] = useState(state);
  useEffect(() => {
    listeners.add(setS);
    return () => void listeners.delete(setS);
  }, []);
  return s;
}

export function useOnline(): boolean {
  const [on, setOn] = useState(navigator.onLine);
  useEffect(() => {
    const up = () => setOn(true);
    const down = () => setOn(false);
    addEventListener('online', up);
    addEventListener('offline', down);
    return () => {
      removeEventListener('online', up);
      removeEventListener('offline', down);
    };
  }, []);
  return on;
}
