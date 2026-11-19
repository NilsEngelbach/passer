---
name: Passer
description: Small on-device tools; every result is a press proof you check before it goes to print.
colors:
  room: "#e4e5e7"
  panel: "#ffffff"
  ink: "#1a1a1a"
  ink-2: "#55585d"
  rule: "#c9cbcf"
  rule-soft: "#e1e2e5"
  fill: "#f3f4f5"
  on-ink: "#ffffff"
  process-cyan: "#00a0e3"
  cyan-ink: "#0077b0"
  process-magenta: "#e5007e"
  magenta-ink: "#b1005f"
  process-yellow: "#ffed00"
  ghost-yellow: "#f2c500"
  paper: "#ffffff"
  paper-ink: "#1a1a1a"
  paper-ink-2: "#55585d"
  room-dark: "#18191b"
  panel-dark: "#212225"
  ink-dark: "#ececed"
  ink-2-dark: "#a5a8ad"
  rule-dark: "#3d3f44"
  rule-soft-dark: "#2e3034"
  fill-dark: "#2a2c30"
  on-ink-dark: "#18191b"
  cyan-ink-dark: "#3cbcf2"
  magenta-ink-dark: "#ff5aa8"
typography:
  display:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "40px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  wordmark:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 750
  body:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum'"
  control:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 650
  label:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 700
  section:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 700
    letterSpacing: "0.08em"
  hint:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  slug:
    fontFamily: "'Hanken Grotesk Variable', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 400
    fontFeature: "'tnum'"
rounded:
  sheet: "0px"
  chip: "5px"
  control: "8px"
  card: "12px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  field: "14px"
  lg: "16px"
  xl: "24px"
  2xl: "32px"
  sheet-x: "60px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 22px"
    height: "42px"
  button-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "42px"
  button-secondary-hover:
    backgroundColor: "{colors.fill}"
  button-ghost:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 16px"
    height: "42px"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    height: "42px"
  input:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "42px"
  segment:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 14px"
    height: "40px"
  segment-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  kind-tile:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.control}"
    padding: "0 10px"
    height: "44px"
  kind-tile-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  tab:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.control}"
    padding: "7px 14px"
  tab-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
  ratio-chip:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.chip}"
    padding: "3px 9px"
  ratio-chip-bad:
    backgroundColor: "{colors.process-magenta}"
    textColor: "#ffffff"
  proof-sheet:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.sheet}"
    padding: "56px 60px 34px"
  tool-entry:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 24px 16px 16px"
---

# Design System: Passer

## Overview

**Creative North Star: "The Press Proof"**

Passer is a press room. The page is a grey room; the form is a white job ticket pinned beside the press; the result is a registered proof sheet, square-cornered paper with crop marks, side registration targets, a colour control strip and a slug line that states the job in plain numbers. Every result is something you check before it goes to print, and the interface is built so that checking is the natural act: input, settings and the current proof sit in one screen, the proof is never behind a button.

The process inks are not decoration. They have jobs: cyan marks focus, magenta marks problems, yellow marks text selection, black marks what is chosen and the one primary action. Everything else is ink on white and grey, ruled with hairlines. One grotesque carries the whole system on a short ramp, with tabular numerals everywhere a measurement appears. Density is a working form's density: 42px controls, 14 to 18px gaps, no ornament between them.

The dark scheme turns the room charcoal and the ticket graphite, but the proof stays paper-white, because the proof shows what will print.

**Key Characteristics:**
- Grey room, white ticket, paper proof: three planes, each with one job.
- Process inks as signals (C focus, M problem, Y selection, K choice), never as fills for decoration.
- One grotesque (Hanken Grotesk), short ramp, tabular numerals globally.
- Square paper, 8px controls: the only sharp corners belong to the proof.
- A registration target is the brand mark, the favicon, the app icon and the proof's own furniture.
- One signature motion: the proof re-registers on change; everything else is a 150ms state change.

## Colors

Neutral press-room greys and ink, with the four process inks held back for signals.

### Primary
- **Press Black** (ink): body text, the selected segment, the selected content type, the current tab, the primary button, the ratio chip. Black means "this one" or "do this". In dark scheme it inverts to Off-White Ink (ink-dark) and its foreground becomes on-ink-dark.

### Secondary
- **Process Cyan** (process-cyan): the C patch on the control strip, the cyan registration ghost, and the 10% tint mixed into the logo drop zone while a file is dragged over it.
- **Cyan Focus Ink** (cyan-ink; cyan-ink-dark in dark): every focus outline (2px, 2px offset; inset -1px on inputs), the text caret, the drag-over border. The darker cyan exists so focus passes contrast on white; the brighter dark-scheme cyan does the same on graphite.

### Tertiary
- **Process Magenta** (process-magenta): the bad-contrast ratio chip fill, the M patch and ghost, the error border on the empty proof, the update button's border, and the brand mark on hover.
- **Magenta Ink** (magenta-ink; magenta-ink-dark in dark): problem text (contrast and margin warnings, logo errors, copy failure) and the invalid input border.
- **Process Yellow** (process-yellow): the text selection highlight (with #1a1a1a text in both schemes) and the Y patch. **Ghost Yellow** (ghost-yellow) is the yellow registration ghost, darker so it reads under multiply on white.

### Neutral
- **Press-Room Grey** (room; room-dark): the page ground and the stage behind the proof. Also the light theme-color.
- **Ticket White** (panel; panel-dark): header bar, form panel, control backgrounds, index entries.
- **Secondary Ink** (ink-2; ink-2-dark): lede, hints, units, unselected tabs, section labels, status line.
- **Hairline Rule** (rule; rule-dark): 1px borders on inputs, segments, ghost buttons, header bottom, ticket edge.
- **Soft Rule** (rule-soft; rule-soft-dark): the divider above each section label inside the ticket.
- **Wash** (fill; fill-dark): hover background for buttons, segments, tabs, drop zone.
- **Paper / Paper Ink** (paper, paper-ink, paper-ink-2): the proof sheet and its marks, strip and slug. These never change with the scheme.

### Named Rules
**The Inks Have Jobs Rule.** Cyan is focus, magenta is a problem or something needing attention (an app update), yellow is selection, black is the choice. Outside those jobs a process ink appears only on the proof's control strip and registration ghosts, and on the registration mark itself (magenta on hover, the out-of-register ring in the app icon). If a new state needs colour, it takes the ink whose job it is or it stays neutral.

**The Paper Never Dims Rule.** The proof sheet and the index's proof thumbnails are paper-white with paper-ink in both schemes. Only the room and the ticket follow the colour scheme.

## Typography

**Display Font:** Hanken Grotesk Variable (self-hosted via @fontsource-variable, with system-ui fallback)
**Body Font:** the same
**Label/Mono Font:** the same; numerals are tabular (`font-variant-numeric: tabular-nums` on body; hex fields add slashed zero)

**Character:** One sturdy grotesque doing every job through weight, not family. Heavy (800) and tight for headings, 650 to 700 for anything you press or read as a label, 400 for prose.

### Hierarchy
- **Display** (800, 40px, 1.15, -0.02em; 32px under 640px): the index page heading only.
- **Headline** (800, 30px, 1.15, -0.02em, balanced wrap; 26px under 640px): a tool's h1 at the top of its ticket.
- **Wordmark** (800, 22px, -0.02em; 19px under 640px): "Passer" beside the registration mark.
- **Title** (750, 20px): a tool's name in an index entry.
- **Body** (400, 15px, 1.5): prose and inputs; lede uses Secondary Ink, max 60ch (17px on the index).
- **Control** (650, 14px; buttons 700, 15px): segments, content-type tiles, tabs (15px).
- **Label** (700, 13px): field labels above every input; optional marker in 500 Secondary Ink.
- **Section** (700, 12px, 0.08em, uppercase, Secondary Ink, soft rule above): the legend of each settings fieldset in the ticket (Output, Inks, Logo). It names a group of controls; it never sits above a heading.
- **Hint** (400, 13px, 1.45, max 62ch): help text under a control.
- **Slug** (400, 11.5px; first item 700 uppercase 0.04em): the proof's slug line. Patch captions are 650, 11px.

### Named Rules
**The Tabular Rule.** Every number a person compares (pixels, modules, centimetres, ratios, dates, hex codes) is set in tabular figures. It is on by default at body level; never turn it off.

## Layout

The tool page is two columns under a sticky 60px header: the ticket on the left (minmax(400px, 540px), white, padded 24px 32px 40px, 18px between groups, 1px rule on its right edge) and the stage on the right (the grey room, sticky to the viewport below the header, scrolls on its own, 32px padding). The stage centres a column up to 600px wide holding the proof sheet, the verdict line and the export strip, 18px apart.

Inside the ticket: content-type tiles in a 4-column grid with 6px gaps; size, margin and frame in a 1.2fr / 1.2fr / 0.8fr row with 14px gaps; contact fields in a 2-column grid; inks as colour / swap / colour. Groups are 16px apart internally, labels sit 8px above controls, hints 6px below.

The index is a single 880px column (padding 56px 32px 72px, 32px gaps): heading, lede, a list of tool entries 12px apart, and a ruled list of facts.

Responsive behaviour:
- **≤960px:** the two columns stack; the ticket gets a bottom rule instead of a right one; the stage becomes static with 32px 20px 48px padding.
- **≤640px:** header drops to 56px, padding 12px, the status line hides, the "All tools" tab shows its short label; tiles go to 2 columns (the last spans both); size/margin share a row and frame takes the next; inks go 2-up with swap on its own row; the damage-tolerance segments stack name over percentage; contact fields go single column; the sheet tightens to 44px 34px 26px with 18px crop marks and 16px targets.
- **Stage narrower than 560px (container query):** the export strip becomes two deliberate rows, the format segments full width above, Copy and Download sharing the row below.

## Elevation & Depth

Flat by default. Planes are separated by tone (room grey, ticket white) and 1px hairlines, not by shadow. Exactly one object casts a real shadow: the proof sheet, lifted off the room like paper on a light table. Its index thumbnails carry a smaller version of the same lift.

### Shadow Vocabulary
- **Sheet lift** (`box-shadow: 0 22px 44px -24px rgba(20,22,26,0.45), 0 2px 6px rgba(20,22,26,0.08)`; dark: `0 24px 50px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.04)`): the proof sheet only.
- **Thumbnail lift** (`box-shadow: 0 6px 14px -8px rgba(0,0,0,0.35)`): the paper thumbnail in an index entry.
- **Entry hover** (`box-shadow: 0 10px 24px -18px rgba(0,0,0,0.5)`): an index entry on hover, with its border turning to ink.
- **Primary ring** (`box-shadow: 0 0 0 3px var(--rule)`): hover on the black primary button, which cannot get darker.

### Named Rules
**The Only Paper Casts Rule.** Shadows belong to paper. Ticket controls, the header and the panels stay flat; state is shown with fill, border and ink, never with lift.

## Shapes

Two corner languages. Interface pieces (inputs, buttons, segments, tiles, tabs, the drop zone) share a gently rounded 8px corner; small chips (contrast ratio, colour swatch) use 5px; index entries use 12px. Paper is square: the proof sheet and its thumbnails have no radius, and their furniture is drawn in 1px hairlines: L-shaped crop marks 26px long, 16px in from each corner, and two 22px registration targets (circle plus crosshair) centred on the left and right edges.

Borders are 1px throughout. A dashed 1px border means "not yet": the empty proof, the logo drop zone, and a disabled button.

The registration target (6.5-unit circle, full crosshair, filled 2.6-unit centre dot, 1.75 stroke) is the brand mark. The favicon and app icons put it in white on a press-black rounded square; the app icons add one magenta ring slightly out of register.

## Components

### Buttons
Firm and plain: ink border, ink text, no gradients.
- **Shape:** gently rounded (8px), 42px tall, 0 16px padding, 700 weight 15px, 8px icon gap, 18px icons.
- **Primary:** Press Black fill, on-ink text, 0 22px padding. One per view: Download. Hover adds the 3px rule ring.
- **Secondary (default):** Ticket White with a 1px ink border; hover fills with Wash.
- **Ghost:** the same with a hairline border; hover darkens the border to Secondary Ink; pressed (`aria-pressed`) borders in ink. Used for Copy, Swap, Show password, remove logo (icon-only, 42px square).
- **Active:** 1px press down (translateY), 100ms.
- **Disabled:** transparent, dashed hairline border, Secondary Ink text, not-allowed cursor. Never faded with opacity.
- **Update (header):** 36px, magenta border, magenta-ink text, refresh icon.

### Segmented controls
The system's main chooser: radio groups drawn as one ruled bar.
- **Style:** hairline border around the group, 1px dividers between options, 8px outer corner, 40px tall, 0 14px padding, Control type. A `<small>` inside holds a secondary value (e.g. "15 %") at 12px, 500, 75% opacity.
- **States:** hover fills with Wash; selected (checked radio or `aria-pressed`) is Press Black with on-ink text; keyboard focus draws a cyan-ink outline inset 4px with a 6px radius.
- **Variants:** small (32px, 13px; language switch, logo size), fill/wide (stretch to the row).

### Content-type tiles
- **Style:** 44px tiles with icon plus word, hairline border, 8px corner, Control type, 4 per row (2 on phones).
- **States:** hover border Secondary Ink; selected solid Press Black; focus cyan-ink outline 2px offset.

### Inputs / Fields
- **Style:** 42px, hairline border, 8px corner, Ticket White, 0 12px padding; textarea min 96px, vertical resize. Label (13px 700) above, hint below.
- **Hover:** border to Secondary Ink. **Focus:** 2px cyan-ink outline at -1px plus cyan-ink border.
- **Error:** `aria-invalid` turns the border magenta-ink.
- **Stepper:** minus / value + unit / plus in one 42px ruled bar; the whole bar borders cyan-ink while focused; buttons disabled at the limits draw in rule grey.
- **Colour field:** 42px swatch button (3px inset, 5px swatch corner) beside a lowercase tabular hex input.
- **Drop zone:** dashed Secondary Ink border, upload icon, two-line label; hover/focus Wash; drag-over solid cyan-ink border on a 10% cyan tint.

### Navigation
- **Header:** sticky white bar, 60px, hairline bottom, 24px side padding, 20px gaps: brand (registration mark + wordmark; mark turns magenta on hover), tool tabs, then status line and EN/DE small segment at the end.
- **Tabs:** 7px 14px, 8px corner, 650 weight, Secondary Ink; hover Wash with ink text; current page solid Press Black. Scroll horizontally when they overflow.
- **Skip link:** Press Black chip revealed on focus.

### Notes and verdicts
- **Ratio chip:** 5px corner, 3px 9px, 750 weight 13px, Press Black; Process Magenta with white text when contrast fails.
- **Verdict lines:** 14px 600 with a 16px check or alert icon; problems in magenta-ink.
- **Export message:** 14px Secondary Ink, right-aligned under the strip; magenta-ink on failure.

### Index entry
- **Style:** a 12px-cornered white card with a hairline border: paper thumbnail (128px, square, small crop marks, the tool's glyph), title and summary, "Open" with arrow. Hover borders in ink and adds the entry hover shadow. Phones: 88px thumbnail, no "Open".

### Proof sheet (signature)
The result is always presented as a proof.
- **Sheet:** paper-white, square, sheet lift, 56px 60px 34px padding, centred output up to 400px square.
- **Marks:** four L crop marks and two side registration targets in 1px paper-ink.
- **Control strip:** a 26px ruled bar of six patches in a 2 / 2 / 1 / 1 / 1 / 1 grid: the user's code ink, the user's background, then C, M, Y, K. Captions ("Code", "Ground") hang 5px below the first two. With no code yet the user patches are hatched.
- **Slug line:** product and tool in bold caps, then size, print size at 300 dpi, damage tolerance and margin separated by middots, then the date.
- **Empty / error:** a dashed square in the output's place; on overflow it turns magenta-bordered with magenta-ink text on a pale pink ground.
- **Re-registration motion:** three ghost copies of the marks (cyan, magenta, ghost-yellow; multiply blend, hidden at rest) sit over the black marks. 160ms after the output changes, each ghost jumps out of register (3,-2 / -2.5,2 / 1.5,3 px) at 0.95 opacity and slides back to zero over 260ms on cubic-bezier(0.16,1,0.3,1), staggered 20ms. Never on first render; never under reduced motion.

## Do's and Don'ts

### Do:
- **Do** put every tool's result on a proof sheet: paper-white, square, crop marks, side registration targets, control strip and a slug line stating the job's numbers.
- **Do** give each process ink only its job: cyan-ink for focus (2px outline), magenta for problems, yellow for text selection, Press Black for the selected option and the single primary action.
- **Do** keep the proof paper-white (#ffffff) with #1a1a1a ink in the dark scheme too.
- **Do** build choices as segmented ruled bars or ruled tiles with a solid Press Black selected state.
- **Do** set every measurement in tabular figures and give numbers their units (px, modules, cm, %).
- **Do** keep interface corners at 8px, chips at 5px, paper at 0.
- **Do** use dashed 1px borders for "not yet" (empty proof, drop zone, disabled button) instead of fading with opacity.
- **Do** draw new icons on the authored 24-unit grid with a 1.75 round-joined stroke.

### Don't:
- **Don't** float the output in a rounded "Output" card or a second equal white panel; the result sits on the room as a proof.
- **Don't** add shadows to ticket controls, panels or the header; only paper casts.
- **Don't** use cyan, magenta or yellow as decorative fills, badges or accents outside their jobs, the control strip and the registration mark.
- **Don't** add a second typeface; vary weight within Hanken Grotesk.
- **Don't** animate anything but state changes (150ms) and the proof's re-registration; no motion under reduced motion.
- **Don't** put an eyebrow or kicker above a heading; small uppercase type is reserved for fieldset section labels and the slug line.
