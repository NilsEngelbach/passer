// What each content type puts into the code. These are the formats phone cameras
// recognise (iOS and Android): plain text, URLs, mailto:, tel:, SMSTO:, WIFI:, vCard 3.0.

export type Kind = 'text' | 'url' | 'email' | 'phone' | 'sms' | 'wifi' | 'vcard';
export const KINDS: Kind[] = ['text', 'url', 'email', 'phone', 'sms', 'wifi', 'vcard'];

export interface Fields {
  text: string;
  url: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  phone: string;
  smsTo: string;
  smsBody: string;
  wifiSsid: string;
  wifiPassword: string;
  wifiSecurity: 'WPA' | 'WEP' | 'nopass';
  wifiHidden: boolean;
  vFirst: string;
  vLast: string;
  vOrg: string;
  vTitle: string;
  vPhone: string;
  vEmail: string;
  vUrl: string;
  vStreet: string;
  vZip: string;
  vCity: string;
  vCountry: string;
}

export const EMPTY_FIELDS: Fields = {
  text: '',
  url: '',
  emailTo: '',
  emailSubject: '',
  emailBody: '',
  phone: '',
  smsTo: '',
  smsBody: '',
  wifiSsid: '',
  wifiPassword: '',
  wifiSecurity: 'WPA',
  wifiHidden: false,
  vFirst: '',
  vLast: '',
  vOrg: '',
  vTitle: '',
  vPhone: '',
  vEmail: '',
  vUrl: '',
  vStreet: '',
  vZip: '',
  vCity: '',
  vCountry: '',
};

/** Adds https:// when someone types "example.com". Leaves other schemes alone. */
export function normaliseUrl(raw: string): string {
  const s = raw.trim();
  if (!s) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(s)) return s;
  return 'https://' + s.replace(/^\/+/, '');
}

/** Keeps the leading + and digits; drops spaces, dashes, brackets and slashes. */
export function normalisePhone(raw: string): string {
  // "+49 (0)30 …": the bracketed trunk 0 is only dialled without the country code.
  const s = raw.trim().replace(/\(\s*0\s*\)/g, '');
  return (s.startsWith('+') ? '+' : '') + s.replace(/[^0-9*#]/g, '');
}

// WIFI: and MECARD-style fields escape \ ; , : and "
const wifiEsc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
// vCard 3.0 text values escape \ ; , and newlines
const vEsc = (s: string) => s.trim().replace(/\\/g, '\\\\').replace(/([;,])/g, '\\$1').replace(/\r?\n/g, '\\n');

export function buildPayload(kind: Kind, f: Fields): string {
  switch (kind) {
    case 'text':
      return f.text;
    case 'url':
      return normaliseUrl(f.url);
    case 'email': {
      const to = f.emailTo.trim();
      if (!to && !f.emailSubject && !f.emailBody) return '';
      const q = [
        f.emailSubject && 'subject=' + encodeURIComponent(f.emailSubject),
        f.emailBody && 'body=' + encodeURIComponent(f.emailBody),
      ].filter(Boolean);
      return 'mailto:' + to + (q.length ? '?' + q.join('&') : '');
    }
    case 'phone': {
      const n = normalisePhone(f.phone);
      return n ? 'tel:' + n : '';
    }
    case 'sms': {
      const n = normalisePhone(f.smsTo);
      if (!n && !f.smsBody) return '';
      return 'SMSTO:' + n + ':' + f.smsBody;
    }
    case 'wifi': {
      if (!f.wifiSsid) return '';
      const parts = [`T:${f.wifiSecurity}`, `S:${wifiEsc(f.wifiSsid)}`];
      if (f.wifiSecurity !== 'nopass') parts.push(`P:${wifiEsc(f.wifiPassword)}`);
      if (f.wifiHidden) parts.push('H:true');
      return 'WIFI:' + parts.join(';') + ';;';
    }
    case 'vcard': {
      const has = [f.vFirst, f.vLast, f.vOrg, f.vPhone, f.vEmail, f.vUrl].some((v) => v.trim());
      if (!has) return '';
      const full = [f.vFirst, f.vLast].map((s) => s.trim()).filter(Boolean).join(' ') || f.vOrg.trim();
      const lines = ['BEGIN:VCARD', 'VERSION:3.0', `N:${vEsc(f.vLast)};${vEsc(f.vFirst)};;;`, `FN:${vEsc(full)}`];
      if (f.vOrg.trim()) lines.push(`ORG:${vEsc(f.vOrg)}`);
      if (f.vTitle.trim()) lines.push(`TITLE:${vEsc(f.vTitle)}`);
      if (f.vPhone.trim()) lines.push(`TEL;TYPE=CELL:${normalisePhone(f.vPhone)}`);
      if (f.vEmail.trim()) lines.push(`EMAIL:${f.vEmail.trim()}`);
      if (f.vUrl.trim()) lines.push(`URL:${normaliseUrl(f.vUrl)}`);
      if ([f.vStreet, f.vZip, f.vCity, f.vCountry].some((v) => v.trim())) {
        lines.push(`ADR;TYPE=WORK:;;${vEsc(f.vStreet)};${vEsc(f.vCity)};;${vEsc(f.vZip)};${vEsc(f.vCountry)}`);
      }
      lines.push('END:VCARD');
      return lines.join('\r\n');
    }
  }
}

/** Short file name stem from the content, e.g. "qr-wifi-HomeNet". */
export function fileStem(kind: Kind, f: Fields): string {
  const hint =
    kind === 'url' ? normaliseUrl(f.url).replace(/^https?:\/\/(www\.)?/, '').split(/[/?#]/)[0]
    : kind === 'wifi' ? f.wifiSsid
    : kind === 'vcard' ? [f.vFirst, f.vLast].join(' ').trim() || f.vOrg
    : kind === 'email' ? f.emailTo.split('@')[0]
    : kind === 'phone' ? normalisePhone(f.phone)
    : kind === 'sms' ? normalisePhone(f.smsTo)
    : '';
  const safe = hint.normalize('NFKD').replace(/[^\w.+-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40);
  return ['qr', kind === 'text' ? '' : kind, safe].filter(Boolean).join('-');
}
