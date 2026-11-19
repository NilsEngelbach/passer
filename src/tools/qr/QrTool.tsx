import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { ComponentChildren, HTMLAttributes, TargetedEvent } from 'preact';
import { useI18n, type Key } from '../../i18n';
import { Icon, type IconName } from '../../ui/icons';
import { loadEncoder, ECC_LEVELS, ECC_RECOVERY, type Ecc, type Encoder } from './encoder';
import { KINDS, EMPTY_FIELDS, buildPayload, fileStem, type Fields, type Kind } from './payload';
import {
  toSvg, toBlob, contrast, normaliseHex, FORMATS,
  type Format, type Logo, type LogoSize, type Look,
} from './render';

// ── Persistence: settings in localStorage, typed content only for this tab ───

interface Settings {
  kind: Kind;
  ecc: Ecc;
  px: number;
  margin: number;
  dark: string;
  light: string;
  border: boolean;
  logoSize: LogoSize;
  format: Format;
}

const DEFAULTS: Settings = {
  kind: 'url', ecc: 'M', px: 1000, margin: 4, dark: '#1a1a1a', light: '#ffffff', border: false, logoSize: 'M', format: 'png',
};
const SIZE = { min: 64, max: 4000, step: 100 };
const MARGIN = { min: 0, max: 20 };

function load<T extends object>(store: () => Storage, key: string, fallback: T): T {
  try {
    const raw = store().getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}
function save(store: () => Storage, key: string, value: unknown) {
  try {
    store().setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked or full */
  }
}

const KIND_ICON: Record<Kind, IconName> = {
  text: 'text', url: 'url', email: 'email', phone: 'phone', sms: 'sms', wifi: 'wifi', vcard: 'vcard',
};

export function QrTool() {
  const { t } = useI18n();
  const [s, setS] = useState<Settings>(() => load(() => localStorage, 'passer.qr.settings', DEFAULTS));
  const [f, setF] = useState<Fields>(() => load(() => sessionStorage, 'passer.qr.fields', EMPTY_FIELDS));
  const [logo, setLogo] = useState<Logo | null>(null);
  const [logoNote, setLogoNote] = useState<Key | null>(null);
  const [encoder, setEncoder] = useState<Encoder | null>(null);
  const [encoderFailed, setEncoderFailed] = useState(false);

  useEffect(() => {
    loadEncoder().then(setEncoder, () => setEncoderFailed(true));
  }, []);
  useEffect(() => save(() => localStorage, 'passer.qr.settings', s), [s]);
  useEffect(() => save(() => sessionStorage, 'passer.qr.fields', f), [f]);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setS((p) => ({ ...p, [k]: v }));
  const field = <K extends keyof Fields>(k: K) => (v: Fields[K]) => setF((p) => ({ ...p, [k]: v }));

  const payload = useMemo(() => buildPayload(s.kind, f), [s.kind, f]);
  const result = useMemo(() => (encoder ? encoder.encode(payload, s.ecc, s.margin) : null), [encoder, payload, s.ecc, s.margin]);
  const look: Look = { px: s.px, dark: s.dark, light: s.light, border: s.border, logo, logoSize: s.logoSize };

  const onLogo = (l: Logo | null, error?: boolean) => {
    setLogo(l);
    if (error) return setLogoNote('s.logo.bad');
    if (l && (s.ecc === 'L' || s.ecc === 'M')) {
      set('ecc', 'H');
      setLogoNote('s.logo.raised');
    } else setLogoNote(null);
  };

  return (
    <div class="qr">
      <form class="ticket" onSubmit={(e) => e.preventDefault()} aria-labelledby="qr-title">
        <div class="ticket-head">
          <h1 id="qr-title">{t('qr.title')}</h1>
          <p class="lede">{t('qr.lede')}</p>
        </div>

        <fieldset class="group">
          <legend class="lbl">{t('qr.kind')}</legend>
          <div class="kinds">
            {KINDS.map((k) => (
              <label key={k} class="kind">
                <input type="radio" name="kind" value={k} checked={s.kind === k} onChange={() => set('kind', k)} />
                <span>
                  <Icon name={KIND_ICON[k]} />
                  {t(`kind.${k}` as Key)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <div class="group content">
          <ContentFields kind={s.kind} f={f} field={field} />
        </div>

        <fieldset class="group">
          <legend class="sec">{t('s.output')}</legend>
          <div class="row3">
            <Stepper
              id="qr-size" label={t('s.size')} unit="px" value={s.px} {...SIZE}
              onChange={(v) => set('px', v)}
            />
            <Stepper
              id="qr-margin" label={t('s.margin')} unit={t('s.margin.unit')} value={s.margin} step={1} {...MARGIN}
              onChange={(v) => set('margin', v)}
            />
            <div class="field">
              <span class="lbl" id="qr-frame-l">{t('s.frame')}</span>
              <div class="seg seg-fill" role="radiogroup" aria-labelledby="qr-frame-l">
                {[false, true].map((v) => (
                  <label key={String(v)}>
                    <input type="radio" name="frame" checked={s.border === v} onChange={() => set('border', v)} />
                    <span>{v ? t('s.on') : t('s.off')}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div class="field">
            <span class="lbl" id="qr-ecc-l">{t('s.ecc')}</span>
            <div class="seg seg-wide" role="radiogroup" aria-labelledby="qr-ecc-l" aria-describedby="qr-ecc-h">
              {ECC_LEVELS.map((e) => (
                <label key={e}>
                  <input type="radio" name="ecc" value={e} checked={s.ecc === e} onChange={() => set('ecc', e)} />
                  <span>
                    {t(`ecc.${e}` as Key)} <small>{ECC_RECOVERY[e]} %</small>
                  </span>
                </label>
              ))}
            </div>
            <p class="hint" id="qr-ecc-h">{t('s.ecc.hint')}</p>
          </div>
        </fieldset>

        <fieldset class="group">
          <legend class="sec">{t('s.colours')}</legend>
          <div class="inks">
            <ColourField id="qr-dark" label={t('s.dark')} value={s.dark} onChange={(v) => set('dark', v)} />
            <button
              type="button" class="btn btn-ghost swap" title={t('s.swap')}
              onClick={() => setS((p) => ({ ...p, dark: p.light, light: p.dark }))}
            >
              <Icon name="swap" />
              <span>{t('s.swap')}</span>
            </button>
            <ColourField id="qr-light" label={t('s.light')} value={s.light} onChange={(v) => set('light', v)} />
          </div>
        </fieldset>

        <fieldset class="group">
          <legend class="sec">{t('s.logo')}</legend>
          <LogoField logo={logo} onLogo={onLogo} size={s.logoSize} onSize={(v) => set('logoSize', v)} />
          {logoNote && (
            <p class={logoNote === 's.logo.bad' ? 'note note-bad' : 'note'} role="status">
              <Icon name={logoNote === 's.logo.bad' ? 'alert' : 'check'} size={16} />
              {t(logoNote)}
            </p>
          )}
        </fieldset>
      </form>

      <Stage
        result={result} failed={encoderFailed} look={look} settings={s}
        stem={fileStem(s.kind, f)} setFormat={(v) => set('format', v)}
      />
    </div>
  );
}

// ── Content fields per kind ─────────────────────────────────────────────────

type FieldSetter = <K extends keyof Fields>(k: K) => (v: Fields[K]) => void;

function ContentFields({ kind, f, field }: { kind: Kind; f: Fields; field: FieldSetter }) {
  const { t } = useI18n();
  switch (kind) {
    case 'text':
      return (
        <TextField
          id="qr-text" label={t('f.text')} value={f.text} onInput={field('text')} multiline
          placeholder={t('f.text.ph')} hint={t('f.chars', { n: [...f.text].length })}
        />
      );
    case 'url':
      return (
        <TextField
          id="qr-url" label={t('f.url')} value={f.url} onInput={field('url')} type="url" inputMode="url"
          placeholder={t('f.url.ph')} hint={t('f.url.hint')} autocomplete="url"
        />
      );
    case 'email':
      return (
        <>
          <TextField id="qr-email-to" label={t('f.emailTo')} value={f.emailTo} onInput={field('emailTo')} type="email" autocomplete="email" />
          <TextField id="qr-email-subj" label={t('f.emailSubject')} optional value={f.emailSubject} onInput={field('emailSubject')} />
          <TextField id="qr-email-body" label={t('f.emailBody')} optional value={f.emailBody} onInput={field('emailBody')} multiline />
        </>
      );
    case 'phone':
      return (
        <TextField
          id="qr-phone" label={t('f.phone')} value={f.phone} onInput={field('phone')} type="tel" autocomplete="tel"
          placeholder="+49 30 1234567" hint={t('f.phone.hint')}
        />
      );
    case 'sms':
      return (
        <>
          <TextField id="qr-sms-to" label={t('f.smsTo')} value={f.smsTo} onInput={field('smsTo')} type="tel" placeholder="+49 151 2345678" />
          <TextField id="qr-sms-body" label={t('f.smsBody')} optional value={f.smsBody} onInput={field('smsBody')} multiline />
        </>
      );
    case 'wifi':
      return <WifiFields f={f} field={field} />;
    case 'vcard':
      return (
        <div class="grid2">
          <TextField id="v-first" label={t('f.vFirst')} value={f.vFirst} onInput={field('vFirst')} autocomplete="given-name" />
          <TextField id="v-last" label={t('f.vLast')} value={f.vLast} onInput={field('vLast')} autocomplete="family-name" />
          <TextField id="v-org" label={t('f.vOrg')} optional value={f.vOrg} onInput={field('vOrg')} autocomplete="organization" />
          <TextField id="v-title" label={t('f.vTitle')} optional value={f.vTitle} onInput={field('vTitle')} autocomplete="organization-title" />
          <TextField id="v-phone" label={t('f.vPhone')} optional value={f.vPhone} onInput={field('vPhone')} type="tel" autocomplete="tel" />
          <TextField id="v-email" label={t('f.vEmail')} optional value={f.vEmail} onInput={field('vEmail')} type="email" autocomplete="email" />
          <TextField id="v-url" label={t('f.vUrl')} optional value={f.vUrl} onInput={field('vUrl')} type="url" inputMode="url" autocomplete="url" class="span2" />
          <TextField id="v-street" label={t('f.vStreet')} optional value={f.vStreet} onInput={field('vStreet')} autocomplete="street-address" class="span2" />
          <TextField id="v-zip" label={t('f.vZip')} optional value={f.vZip} onInput={field('vZip')} autocomplete="postal-code" />
          <TextField id="v-city" label={t('f.vCity')} optional value={f.vCity} onInput={field('vCity')} autocomplete="address-level2" />
          <TextField id="v-country" label={t('f.vCountry')} optional value={f.vCountry} onInput={field('vCountry')} autocomplete="country-name" class="span2" />
        </div>
      );
  }
}

function WifiFields({ f, field }: { f: Fields; field: FieldSetter }) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <>
      <TextField
        id="wifi-ssid" label={t('f.wifiSsid')} value={f.wifiSsid} onInput={field('wifiSsid')} autocomplete="off" spellcheck={false}
        hint={t('f.wifi.hint')}
      />
      <div class="field">
        <span class="lbl" id="wifi-sec-l">{t('f.wifiSecurity')}</span>
        <div class="seg" role="radiogroup" aria-labelledby="wifi-sec-l">
          {(
            [
              ['WPA', 'f.wifi.wpa'],
              ['WEP', 'f.wifi.wep'],
              ['nopass', 'f.wifi.none'],
            ] as const
          ).map(([v, k]) => (
            <label key={v}>
              <input type="radio" name="wifi-sec" checked={f.wifiSecurity === v} onChange={() => field('wifiSecurity')(v)} />
              <span>{t(k)}</span>
            </label>
          ))}
        </div>
      </div>
      {f.wifiSecurity !== 'nopass' && (
        <div class="field">
          <label class="lbl" for="wifi-pass">{t('f.wifiPassword')}</label>
          <div class="input-group">
            <input
              id="wifi-pass" class="input" {...{ type: (show ? 'text' : 'password') as 'text' }} value={f.wifiPassword}
              onInput={(e) => field('wifiPassword')(e.currentTarget.value)} autocomplete="off" spellcheck={false}
            />
            <button type="button" class="btn btn-ghost" aria-pressed={show} onClick={() => setShow(!show)}>
              <Icon name="eye" size={18} />
              {show ? t('f.hidePassword') : t('f.showPassword')}
            </button>
          </div>
        </div>
      )}
      <label class="check">
        <input type="checkbox" checked={f.wifiHidden} onChange={(e) => field('wifiHidden')(e.currentTarget.checked)} />
        <span>{t('f.wifiHidden')}</span>
      </label>
    </>
  );
}

// ── Form atoms ──────────────────────────────────────────────────────────────

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onInput: (v: string) => void;
  multiline?: boolean;
  optional?: boolean;
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'url' | 'email' | 'tel';
  inputMode?: HTMLAttributes['inputMode'];
  autocomplete?: string;
  spellcheck?: boolean;
  class?: string;
}

function TextField({ id, label, value, onInput, multiline, optional, hint, class: cls, ...rest }: TextFieldProps) {
  const { t } = useI18n();
  const props = {
    id,
    class: 'input',
    value,
    'aria-describedby': hint ? `${id}-h` : undefined,
    onInput: (e: TargetedEvent<HTMLInputElement | HTMLTextAreaElement>) => onInput(e.currentTarget.value),
    ...rest,
  };
  return (
    <div class={cls ? `field ${cls}` : 'field'}>
      <label class="lbl" for={id}>
        {label}
        {optional && <span class="opt"> · {t('f.optional')}</span>}
      </label>
      {multiline ? <textarea rows={4} {...props} /> : <input {...props} {...{ type: (rest.type ?? 'text') as 'text' }} />}
      {hint && (
        <p class="hint" id={`${id}-h`}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Stepper(p: {
  id: string; label: string; unit: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void;
}) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(String(p.value));
  useEffect(() => setDraft(String(p.value)), [p.value]);
  const clamp = (v: number) => Math.min(p.max, Math.max(p.min, Math.round(v)));
  const commit = (raw: string) => {
    const v = parseInt(raw, 10);
    if (Number.isFinite(v)) p.onChange(clamp(v));
    else setDraft(String(p.value));
  };
  // Snap to the step grid when stepping, so 437 + 100 becomes 500, not 537.
  const stepBy = (dir: 1 | -1) =>
    p.onChange(clamp(dir > 0 ? Math.floor(p.value / p.step) * p.step + p.step : Math.ceil(p.value / p.step) * p.step - p.step));
  return (
    <div class="field">
      <label class="lbl" for={p.id}>
        {p.label}
      </label>
      <div class="stepper">
        <button type="button" onClick={() => stepBy(-1)} disabled={p.value <= p.min} aria-label={`${t('s.decrease')}: ${p.label}`}>
          <Icon name="minus" size={18} />
        </button>
        <span class="stepper-val">
          <input
            id={p.id} inputMode="numeric" value={draft} aria-describedby={`${p.id}-u`}
            style={{ width: `${Math.max(2, draft.length) + 0.5}ch` }}
            onInput={(e) => {
              setDraft(e.currentTarget.value);
              const v = parseInt(e.currentTarget.value, 10);
              if (Number.isFinite(v) && v >= p.min && v <= p.max) p.onChange(v);
            }}
            onBlur={(e) => commit(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowUp') (e.preventDefault(), stepBy(1));
              if (e.key === 'ArrowDown') (e.preventDefault(), stepBy(-1));
              if (e.key === 'Enter') commit(e.currentTarget.value);
            }}
          />
          <span class="unit" id={`${p.id}-u`}>
            {p.unit}
          </span>
        </span>
        <button type="button" onClick={() => stepBy(1)} disabled={p.value >= p.max} aria-label={`${t('s.increase')}: ${p.label}`}>
          <Icon name="plus" size={18} />
        </button>
      </div>
    </div>
  );
}

function ColourField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const valid = normaliseHex(draft) !== null;
  return (
    <div class="field colour">
      <label class="lbl" for={id}>
        {label}
      </label>
      <div class="colour-in">
        <input
          type="color" value={value} aria-label={label}
          onInput={(e) => onChange(e.currentTarget.value)}
        />
        <input
          id={id} class="input hex" value={draft} spellcheck={false} autocomplete="off" maxLength={7}
          aria-invalid={!valid} aria-description={t('s.hex')}
          onInput={(e) => {
            setDraft(e.currentTarget.value);
            const n = normaliseHex(e.currentTarget.value);
            if (n) onChange(n);
          }}
          onBlur={() => setDraft(value)}
        />
      </div>
    </div>
  );
}

function LogoField({ logo, onLogo, size, onSize }: {
  logo: Logo | null; onLogo: (l: Logo | null, error?: boolean) => void; size: LogoSize; onSize: (s: LogoSize) => void;
}) {
  const { t } = useI18n();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const read = (file: File | undefined) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onload = () => onLogo({ src, img, name: file.name });
      img.onerror = () => onLogo(null, true);
      img.src = src;
    };
    reader.onerror = () => onLogo(null, true);
    reader.readAsDataURL(file);
  };

  if (logo) {
    return (
      <div class="logo-set">
        <img src={logo.src} alt="" class="logo-thumb" />
        <span class="logo-name">{logo.name}</span>
        <div class="seg seg-sm" role="radiogroup" aria-label={t('s.logo.size')}>
          {(['S', 'M', 'L'] as LogoSize[]).map((v) => (
            <label key={v}>
              <input type="radio" name="logo-size" checked={size === v} onChange={() => onSize(v)} />
              <span>{v}</span>
            </label>
          ))}
        </div>
        <button type="button" class="btn btn-ghost icon-only" onClick={() => onLogo(null)} aria-label={t('s.logo.remove')} title={t('s.logo.remove')}>
          <Icon name="close" size={18} />
        </button>
      </div>
    );
  }
  return (
    <label
      class={over ? 'drop over' : 'drop'}
      onDragOver={(e) => (e.preventDefault(), setOver(true))}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        read(e.dataTransfer?.files[0]);
      }}
    >
      <input
        ref={input} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp" class="visually-hidden"
        onChange={(e) => {
          read(e.currentTarget.files?.[0]);
          e.currentTarget.value = '';
        }}
      />
      <Icon name="upload" />
      <span class="drop-main">{t('s.logo.drop')}</span>
      <span class="drop-sub">{t('s.logo.types')}</span>
    </label>
  );
}

// ── The proof: preview, control strip, slug line, export ─────────────────────

function Stage({ result, failed, look, settings, stem, setFormat }: {
  result: ReturnType<Encoder['encode']> | null; failed: boolean; look: Look; settings: Settings; stem: string;
  setFormat: (f: Format) => void;
}) {
  const { t, lang } = useI18n();
  const qr = result?.ok ? result.qr : null;
  const svg = useMemo(() => (qr ? toSvg(qr, look) : ''), [qr, look.px, look.dark, look.light, look.border, look.logo, look.logoSize]);
  const src = svg && 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const c = contrast(look.dark, look.light);
  const [msg, setMsg] = useState<{ text: string; bad?: boolean } | null>(null);
  useEffect(() => setMsg(null), [svg, settings.format]);

  const cmAt300 = new Intl.NumberFormat(lang === 'de' ? 'de-DE' : 'en-GB', { maximumFractionDigits: 1 }).format(
    (look.px / 300) * 2.54,
  );
  const date = new Intl.DateTimeFormat(lang === 'de' ? 'de-DE' : 'en-GB', { dateStyle: 'medium' }).format(new Date());

  const download = async () => {
    if (!qr) return;
    const blob = await toBlob(qr, look, settings.format);
    let ext = settings.format === 'jpeg' ? 'jpg' : settings.format;
    let note: string | null = null;
    if (settings.format === 'webp' && blob.type !== 'image/webp') {
      // Safari before 17 cannot encode WEBP and silently returns PNG.
      ext = 'png';
      note = t('x.webpFallback');
    }
    const name = `${stem}.${ext}`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    setMsg({ text: note ?? t('x.saved', { name }) });
  };

  const copy = async () => {
    if (!qr) return;
    try {
      if (settings.format === 'svg') await navigator.clipboard.writeText(toSvg(qr, look));
      // Clipboards accept PNG only; copying always places a PNG.
      else await navigator.clipboard.write([new ClipboardItem({ 'image/png': toBlob(qr, look, 'png') })]);
      setMsg({ text: t('x.copied') });
    } catch {
      setMsg({ text: t('x.copyFailed'), bad: true });
    }
  };

  const warnings: { key: Key; bad: boolean }[] = [];
  if (qr) {
    warnings.push({ key: `c.${c.verdict}` as Key, bad: c.verdict !== 'good' });
    if (look.border && settings.margin < 2) warnings.push({ key: 'c.borderTight', bad: true });
    else if (!look.border && settings.margin < 2) warnings.push({ key: 'c.noMargin', bad: true });
  }

  return (
    <section class="stage" aria-label={t('p.label')}>
      <div class="stage-inner">
        <Proof stamp={svg}>
          {qr ? (
            <img class="proof-img" src={src} alt={t('p.alt')} width={look.px} height={look.px} />
          ) : (
            <div class={result && !result.ok && result.reason === 'too-long' ? 'proof-empty bad' : 'proof-empty'} role="status">
              {failed
                ? t('p.failed')
                : !result
                  ? t('p.loading')
                  : result.ok
                    ? ''
                    : result.reason === 'too-long'
                      ? t('p.tooLong', { bytes: result.bytes, cap: result.capacity })
                      : t('p.empty')}
            </div>
          )}
          <div class="strip" aria-hidden={!qr}>
            <span class="patch" style={{ background: look.dark }}>
              <span>{t('p.ink')}</span>
            </span>
            <span class="patch light" style={{ background: look.light }}>
              <span>{t('p.paper')}</span>
            </span>
            <span class="patch c" />
            <span class="patch m" />
            <span class="patch y" />
            <span class="patch k" />
          </div>
          <p class="slug">
            <span>Passer · QR</span>
            <span class="slug-mid">
              {[
                `${look.px} × ${look.px} px`,
                t('p.print', { cm: cmAt300 }),
                t(`ecc.${settings.ecc}` as Key),
                `${t('s.margin')} ${settings.margin}`,
              ].map((item, i, all) => (
                <span key={i} class="nb">
                  {item}
                  {i < all.length - 1 && ' ·'}
                </span>
              ))}
            </span>
            <span>{date}</span>
          </p>
        </Proof>

        <div class="verdict" aria-live="polite">
          {qr && (
            <span class={c.verdict === 'good' ? 'ratio' : 'ratio bad'}>
              {c.ratio.toFixed(c.ratio >= 10 ? 0 : 1)} : 1
            </span>
          )}
          <ul>
            {warnings.map((w) => (
              <li key={w.key} class={w.bad ? 'bad' : undefined}>
                <Icon name={w.bad ? 'alert' : 'check'} size={16} />
                {t(w.key)}
              </li>
            ))}
          </ul>
        </div>

        <div class="export">
          <div class="seg" role="radiogroup" aria-label={t('x.format')}>
            {FORMATS.map((fm) => (
              <label key={fm}>
                <input type="radio" name="format" checked={settings.format === fm} onChange={() => setFormat(fm)} />
                <span>{fm.toUpperCase()}</span>
              </label>
            ))}
          </div>
          <button type="button" class="btn btn-ghost" onClick={copy} disabled={!qr}>
            <Icon name="copy" size={18} />
            {settings.format === 'svg' ? t('x.copySvg') : t('x.copy')}
          </button>
          <button type="button" class="btn btn-primary" onClick={download} disabled={!qr}>
            <Icon name="download" size={18} />
            {t('x.download')}
          </button>
        </div>
        <p class={msg?.bad ? 'export-msg bad' : 'export-msg'} role="status">
          {msg?.text}
        </p>
      </div>
    </section>
  );
}

/**
 * The proof sheet. Its crop marks and registration targets carry cyan, magenta and
 * yellow ghosts; when the code changes they slip out of register and snap back.
 */
function Proof({ stamp, children }: { stamp: string; children: ComponentChildren }) {
  const ghosts = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) return void (first.current = false);
    if (!stamp || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Wait for a short pause in typing, then register once.
    const id = setTimeout(() => {
      const layers = ghosts.current?.children;
      if (!layers) return;
      const offsets = [
        [3, -2],
        [-2.5, 2],
        [1.5, 3],
      ];
      [...layers].forEach((el, i) =>
        (el as HTMLElement).animate(
          [
            { transform: `translate(${offsets[i][0]}px, ${offsets[i][1]}px)`, opacity: 0.95 },
            { transform: 'translate(0, 0)', opacity: 0 },
          ],
          { duration: 260, easing: 'cubic-bezier(.16,1,.3,1)', delay: i * 20 },
        ),
      );
    }, 160);
    return () => clearTimeout(id);
  }, [stamp]);

  return (
    <div class="sheet">
      <Marks cls="marks" />
      <div class="ghosts" ref={ghosts} aria-hidden="true">
        <Marks cls="marks ghost c" />
        <Marks cls="marks ghost m" />
        <Marks cls="marks ghost y" />
      </div>
      <div class="sheet-body">{children}</div>
    </div>
  );
}

function Marks({ cls }: { cls: string }) {
  return (
    <div class={cls} aria-hidden="true">
      <i class="cm tl" />
      <i class="cm tr" />
      <i class="cm bl" />
      <i class="cm br" />
      <svg class="target l" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6.5" />
        <path d="M12 1.5v21M1.5 12h21" />
      </svg>
      <svg class="target r" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="6.5" />
        <path d="M12 1.5v21M1.5 12h21" />
      </svg>
    </div>
  );
}
