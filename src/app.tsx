import { useEffect, useMemo, useState } from 'preact/hooks';
import type { ComponentChildren } from 'preact';
import { I18n, translator, detectLang, useI18n, type Lang } from './i18n';
import { TOOLS, PRODUCT } from './tools/catalog';
import { QrTool } from './tools/qr/QrTool';
import { Icon, RegMark } from './ui/icons';
import { usePwa, useOnline, applyUpdate } from './pwa';

/** '' for the index, otherwise a tool slug. Unknown paths fall back to the index. */
function routeOf(pathname: string): string {
  const slug = pathname.split('/').filter(Boolean)[0] ?? '';
  return TOOLS.some((t) => t.slug === slug) ? slug : '';
}

export function navigate(href: string) {
  history.pushState(null, '', href);
  dispatchEvent(new PopStateEvent('popstate'));
  scrollTo(0, 0);
}

/** An anchor that switches page without reloading (it stays a real link for new tabs). */
function Link({ href, children, ...rest }: { href: string; children: ComponentChildren; class?: string; 'aria-current'?: 'page' }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function App() {
  const [lang, setLang] = useState<Lang>(detectLang);
  const [route, setRoute] = useState(() => routeOf(location.pathname));
  const i18n = useMemo(() => ({ lang, t: translator(lang) }), [lang]);

  useEffect(() => {
    const on = () => setRoute(routeOf(location.pathname));
    addEventListener('popstate', on);
    return () => removeEventListener('popstate', on);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('passer.lang', lang);
    } catch {
      /* storage blocked */
    }
  }, [lang]);

  const tool = TOOLS.find((t) => t.slug === route);
  useEffect(() => {
    document.title = tool ? `${tool.name[lang]} · ${PRODUCT.name}` : `${PRODUCT.name} · ${i18n.t('index.title')}`;
  }, [tool, lang]);

  return (
    <I18n.Provider value={i18n}>
      <Header route={route} lang={lang} setLang={setLang} />
      <main id="main">{route === 'qr' ? <QrTool /> : <Index />}</main>
    </I18n.Provider>
  );
}

function Header({ route, lang, setLang }: { route: string; lang: Lang; setLang: (l: Lang) => void }) {
  const { t } = useI18n();
  const pwa = usePwa();
  const online = useOnline();
  return (
    <header class="bar">
      <a class="skip" href="#main">
        {lang === 'de' ? 'Zum Inhalt' : 'Skip to content'}
      </a>
      <Link href="/" class="brand">
        <RegMark />
        <span>{PRODUCT.name}</span>
      </Link>
      <nav class="tabs" aria-label={t('nav.label')}>
        {TOOLS.map((tool) => (
          <Link key={tool.slug} href={`/${tool.slug}/`} class="tab" aria-current={route === tool.slug ? 'page' : undefined}>
            {tool.name[lang]}
          </Link>
        ))}
        <Link href="/" class="tab" aria-current={route === '' ? 'page' : undefined}>
          <span class="long">{t('nav.all')}</span>
          <span class="short" aria-hidden="true">
            {t('nav.allShort')}
          </span>
        </Link>
      </nav>
      <div class="bar-end">
        {pwa === 'update' ? (
          <button type="button" class="btn btn-update" onClick={applyUpdate}>
            <Icon name="refresh" size={16} />
            {t('pwa.update')}
          </button>
        ) : (
          <span class="status" aria-live="polite">
            {!online ? (
              t('pwa.noConnection')
            ) : pwa === 'ready' ? (
              <>
                <Icon name="check" size={16} />
                {t('pwa.offline')}
              </>
            ) : pwa === 'preparing' ? (
              t('pwa.preparing')
            ) : (
              t('pwa.local')
            )}
          </span>
        )}
        <div class="seg seg-sm" role="group" aria-label={t('lang.label')}>
          {(['en', 'de'] as Lang[]).map((l) => (
            <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)} lang={l}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

function Index() {
  const { t, lang } = useI18n();
  return (
    <div class="index">
      <div class="index-head">
        <h1>{t('index.title')}</h1>
        <p class="lede">{t('index.lede')}</p>
      </div>
      <ul class="tool-list">
        {TOOLS.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/${tool.slug}/`} class="tool-entry">
              <span class="tool-proof" aria-hidden="true">
                <i class="cm tl" />
                <i class="cm tr" />
                <i class="cm bl" />
                <i class="cm br" />
                <ToolGlyph slug={tool.slug} />
              </span>
              <span class="tool-text">
                <strong>{tool.name[lang]}</strong>
                <span>{tool.summary[lang]}</span>
              </span>
              <span class="tool-open">
                {t('index.open')}
                <Icon name="arrow" size={18} />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p class="index-more">{t('index.more')}</p>
      <ul class="facts">
        <li>{t('index.fact1')}</li>
        <li>{t('index.fact2')}</li>
        <li>{t('index.fact3')}</li>
      </ul>
    </div>
  );
}

function ToolGlyph({ slug }: { slug: string }) {
  if (slug === 'qr') {
    // A tiny, fixed QR-like glyph: three finder patterns and a few modules.
    return (
      <svg viewBox="0 0 21 21" width="72" height="72" shape-rendering="crispEdges" aria-hidden="true">
        <path
          fill="currentColor"
          fill-rule="evenodd"
          d="M0 0h7v7H0zM1 1v5h5V1zM2 2h3v3H2zM14 0h7v7h-7zM15 1v5h5V1zM16 2h3v3h-3zM0 14h7v7H0zM1 15v5h5v-5zM2 16h3v3H2zM9 0h2v2H9zM8 3h1v3H8zM10 4h2v1h-2zM9 8h3v2H9zM14 9h2v3h-2zM17 8h3v1h-3zM18 10h2v2h-2zM8 13h2v2H8zM11 12h2v1h-2zM12 14h3v2h-3zM9 17h2v4H9zM12 18h1v3h-1zM14 17h3v1h-3zM16 19h2v2h-2zM19 15h2v3h-2zM0 9h2v1H0zM3 8h2v3H3zM1 11h1v2H1z"
        />
      </svg>
    );
  }
  return null;
}
