---
version: 1
slug: "src-tools-qr"
primary_target: "src/tools/qr"
related_targets: ["src/app.tsx"]
---

# Passer · QR code tool and app shell

Scope: the app shell (header, tool navigation, index of tools) and the first tool, the QR code generator. Visitor mode: Operate. Audience: the general public making a code for print or sharing; plain words first. Constraint: everything runs on the device, offline, EN/DE.

## Direction contract

THESIS: Every result is a press proof you check before it goes to print. The tool refuses the category's arrangement of two equal white cards with a blue accent and a bare image floating in an "Output" box; here the output is a registered proof sheet on a press-room ground, and the form is the job ticket beside it.

OWN-WORLD: Press-room grey ground (#e4e5e7; dark scheme: charcoal room, proof stays paper-white). White form panel, 1px #c9cbcf rules, ink #1a1a1a, secondary #5b5e63. Process inks do jobs: cyan = focus and selection, magenta = errors and scan warnings, yellow = text selection highlight, black = the selected segment and the primary action. One grotesque (Hanken Grotesk) on a short ramp; tabular numerals for every measurement. Logo: a registration target.

STORY: The visitor sees immediately what to do (pick what the code should do, type), sees the code update live on the proof, reads in the slug line and control strip that it will scan and at what size, and downloads or copies in the format the next tool needs.

FIRST VIEWPORT: 60px white header: registration-target wordmark "Passer", tool tabs (QR code, All tools), offline note, EN/DE switch. Left 520px: the job ticket form, "Make a QR code" heading, type grid (Text, Link, Email, Phone, SMS, WiFi, Contact), content fields, size / margin / border row, damage tolerance segmented control with plain percentages, inks with swap, logo drop zone. Right: grey stage, centred proof sheet with crop marks and side registration targets, the QR at proof scale, colour control strip (dark ink, paper, C, M, Y, K), slug line with live settings; below it the contrast check and the export row (format segments, Copy, Download as the black primary).

FORM: Press proof / print-shop proof sheet. Position 1 of my ordered list (Impeccable's pick, chosen by the user over the roll's assigned parcel-label world). seed:115200fbdad961c3. Signature move: the proof re-registers on every change: the crop marks and registration targets carry faint C/M/Y ghosts that slip out of register and snap back into one black mark (about 260 ms, exponential ease-out; none under reduced motion).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
