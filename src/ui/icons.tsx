// Authored line icons: 24-unit grid, 1.75 stroke, round joins. Decorative by default.
import type { SVGAttributes } from 'preact';

const paths = {
  text: <path d="M5 6h14M5 10.5h14M5 15h9M5 19.5h6" />,
  url: (
    <>
      <path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1" />
      <path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" />
    </>
  ),
  email: (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2Z" />
  ),
  sms: (
    <>
      <path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4Z" />
      <path d="M8 9.5h8M8 12.5h5" />
    </>
  ),
  wifi: (
    <>
      <path d="M2.5 9a14 14 0 0 1 19 0" />
      <path d="M5.5 12.5a9.5 9.5 0 0 1 13 0" />
      <path d="M8.5 16a5 5 0 0 1 7 0" />
      <circle cx="12" cy="19.25" r=".9" fill="currentColor" />
    </>
  ),
  vcard: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <circle cx="9" cy="10.5" r="2.25" />
      <path d="M5.5 16.5a3.75 3.75 0 0 1 7 0M15 9.5h3M15 12.5h3" />
    </>
  ),
  swap: (
    <>
      <path d="M7 4 3.5 7.5 7 11M3.5 7.5h13" />
      <path d="m17 13 3.5 3.5L17 20M20.5 16.5h-13" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="12" height="12" rx="1.5" />
      <path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5" />
    </>
  ),
  download: <path d="M12 3.5v12M7 10.5l5 5 5-5M4 20.5h16" />,
  upload: <path d="M12 15.5v-12M7 8.5l5-5 5 5M4 20.5h16" />,
  arrow: <path d="M4.5 12h15M13.5 6l6 6-6 6" />,
  minus: <path d="M5 12h14" />,
  plus: <path d="M5 12h14M12 5v14" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  alert: (
    <>
      <path d="M12 3.5 2.5 20h19Z" />
      <path d="M12 10v4.5" />
      <circle cx="12" cy="17.25" r=".9" fill="currentColor" />
    </>
  ),
  refresh: (
    <>
      <path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" />
      <path d="M19.5 4v4.5H15" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.75" />
    </>
  ),
  offline: (
    <>
      <path d="M5 13.5a7 7 0 0 1 14 0" />
      <path d="M12 13.5V20M9 17l3 3 3-3" />
    </>
  ),
};

export type IconName = keyof typeof paths;

export function Icon({ name, size = 20, ...rest }: { name: IconName; size?: number } & SVGAttributes<SVGSVGElement>) {
  return (
    <svg
      class="icon"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.75"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}

/** The registration target: the product mark. */
export function RegMark({ size = 22 }: { size?: number }) {
  return (
    <svg class="regmark" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true">
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 1.5v21M1.5 12h21" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
