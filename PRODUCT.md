# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated, with one binding constraint from the user: a lightweight UI framework is fine if it helps, but no sprawling npm dependency tree. Chosen: Vite + TypeScript + Preact (one runtime package, no dependencies of its own). The QR encoder is Rust compiled to WebAssembly without wasm-bindgen (cargo and the wasm32 target are installed); the compiled `.wasm` is committed so a normal build needs no Rust. Offline support comes from a small hand-written service worker whose precache list is generated at build time, not from workbox / vite-plugin-pwa (which would add hundreds of packages). Hosting: static files on all-inkl shared webspace (Apache, PHP available but unused), deployed over SSH by `deploy.sh`, same scheme as the sibling projects Tactus (`../music-tools`) and Essensplan.

## Users

Anyone, the general public: people who need a QR code for a café's WiFi, a business card, a flyer, an event link, or a phone number, and later other everyday conversions. Many are not technical; they don't know what "error correction" or "vCard" means and should not need to. Power users are welcome but not the design target.

## Product Purpose

A growing collection of small, everyday web tools that run entirely in the browser, install as an app, and work offline. The first tool is a QR code generator. Success: someone who needs a QR code reaches for this instead of the ad-laden, sign-up-walled or tracking-redirect QR sites that dominate search results, and gets a correct, printable code in under a minute.

## Positioning

Everything happens on the device: no account, no upload, no tracking, no "dynamic QR" redirect through someone else's server, no watermark, no expiry. Codes encode the content directly and keep working forever. The QR encoder is compiled Rust (WebAssembly), so output is exact and fast, and the whole toolbox keeps working with no network after the first visit.

## Operating Context

- Mostly desktop or laptop for making print material (flyers, menus, table stands, business cards), also phones for quick one-offs (share WiFi with a guest).
- A typical session: pick what the code should do, fill a short form, glance at the preview, maybe adjust colours or add a logo, download or copy, done. Occasionally scan the preview with a phone to check it works.
- Output goes into other tools: Word, Canva, print shops, email signatures, so file formats (PNG, JPEG, WEBP, SVG) and sizes matter.

## Capabilities and Constraints

- Tool 1, QR code generator. Content types: text, URL, email, phone number, SMS, WiFi, vCard. Settings: size (px), error correction (L/M/Q/H), margin (quiet zone in modules). Colours: dark and light colour with a swap, optional border. Optional centre logo (PNG, JPG, SVG). Live preview. Export PNG, JPEG, WEBP, SVG; copy image to clipboard; download.
- The collection grows: navigation must hold many tools without redesign. Which tools come next is undecided.
- UI language: English and German, following the device language, with a manual switch.
- Installable PWA, fully offline after first load. Settings may persist locally on the device; nothing is sent to a server.
- Static hosting only, own subdomain, https.
- Product name: to be proposed as part of this work; none exists yet.

## Brand Commitments

None yet. The name is proposed in this work.

## Evidence on Hand

None. No users, testimonials, usage numbers or benchmarks exist; do not invent any.

## Product Principles

1. Local by construction: nothing a person types or uploads leaves the device, and the product never needs to say "trust us".
2. Plain words first: every control is understandable without knowing the jargon; the jargon is there for those who look for it.
3. Done in one screen: input, settings and result visible together; the result is always current, never behind a "Generate" button.
4. Output that survives print: correct, scannable, at the size and format the next tool needs.
5. One toolbox: every tool shares one language, so the tenth tool feels as native as the first.

## Accessibility & Inclusion

General public audience: WCAG 2.2 AA contrast, full keyboard operation, visible focus, labels on every control, and colour choices in the QR tool warn when dark/light contrast would make the code unscannable. Respect reduced motion.
