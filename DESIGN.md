---
name: Design Style Library
description: A warm-paper reference library of web design languages, set in a quiet serif and sans pairing.
colors:
  paper: "#f6f4f0"
  paper-deep: "#efece6"
  card-white: "#ffffff"
  card-warm: "#faf9f7"
  ink: "#14130f"
  ink-soft: "#514c44"
  ink-faint: "#8b8479"
  rule: "#e2ddd4"
  rule-strong: "#d2ccc0"
  draft-orange: "#ff8a3d"
  copied-green: "#2e7d54"
  match-yellow: "#f5c518"
typography:
  display:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(30px, 4.2vw, 46px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.015em"
  headline:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "clamp(28px, 3.4vw, 40px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Instrument Serif, Georgia, serif"
    fontSize: "25px"
    fontWeight: 400
    lineHeight: 1.14
    letterSpacing: "-0.012em"
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "11.5px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.09em"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "12.5px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  sm: "9px"
  md: "12px"
  lg: "14px"
  xl: "18px"
  pill: "999px"
spacing:
  xs: "6px"
  sm: "10px"
  md: "18px"
  lg: "30px"
  page-gutter: "28px"
components:
  button:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.paper}"
  chip:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "8px 15px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.pill}"
    padding: "4.5px 10px"
  search-input:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "11px 34px 11px 38px"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  modal-panel:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
  prompt-box:
    backgroundColor: "{colors.paper-deep}"
    textColor: "{colors.ink-soft}"
    typography: "{typography.mono}"
    rounded: "{rounded.md}"
    padding: "15px 16px"
---

# Design System: Design Style Library

## Overview

**Creative North Star: "The Reading Room"**

A calm room with warm paper walls and a serif voice. The library is a place to read about design languages, not to be dazzled by one, so the interface is a quiet frame: off-white paper, one near-black ink, hairline rules, and Instrument Serif for every title. Reference screenshots supply all of the colour; the chrome around them stays neutral so no entry competes with another.

Density is moderate: a three-column grid of cards on desktop, with a sticky chip bar for filtering and a modal for the full entry. Everything is rounded and soft (pills, 14px cards) and lifts slightly on hover. The result is coherent and tidy, and the owner calls it generic and safe: it has no point of view of its own beyond staying out of the way. That is the incumbent state, recorded here as a baseline for the redesign rather than as a standard to keep.

The visual anti-reference for the redesign is the template SaaS look: gradient heroes, feature-card rows and stock marketing patterns.

**Key Characteristics:**
- Warm off-white ground with a single near-black ink; no brand accent in the chrome.
- Serif titles over a neutral sans body, with small uppercase tracked labels for metadata.
- Pill-shaped controls (buttons, chips, tags, search) and 14px to 18px rounded surfaces.
- Hairline borders plus one soft shadow recipe; depth is modest and only grows on hover.
- Light and dark are both first-class; dark is a warm near-black, not blue-black.

## Colors

A restrained warm-neutral palette with no chromatic accent in the interface; colour belongs to the content.

### Primary
- **Library Ink** (#14130f): text, the selected chip, the primary button and the toast. It is also the `--accent` token, so the "accent" is simply ink. In dark mode it becomes Parchment (#f4f1ea).

### Neutral
- **Warm Paper** (#f6f4f0): page ground and masthead. Dark: Soot (#100f0d).
- **Deep Paper** (#efece6): tags, code chips, the prompt box, image placeholders. Dark: #171512.
- **Card White** (#ffffff): cards, inputs, chips, the modal panel. Dark: #1b1916.
- **Warm Card** (#faf9f7): the modal action bar and swatch trays. Dark: #211e1a.
- **Soft Ink** (#514c44): secondary text and descriptions. Dark: #b8b1a5.
- **Faint Ink** (#8b8479): metadata, placeholders, counts. Dark: #847d71.
- **Hairline** (#e2ddd4): default borders and dividers. Dark: #2c2823.
- **Strong Hairline** (#d2ccc0): hover and modal borders. Dark: #3a352e.

### Signal
- **Draft Orange** (#ff8a3d): the flag on unclassified cards and the Unsorted category.
- **Copied Green** (#2e7d54): a copy button's confirmed state.
- **Match Yellow** (#f5c518, at 55% mix): search highlight.

Each of the twelve categories also carries its own accent in `data/styles.json` (for example #5b8def for Minimal, #e0533d for Editorial, #00d3a7 for Futuristic). It appears only as a small dot beside a category name, never as a surface.

### Named Rules
**The Content Owns Colour Rule.** Chrome stays neutral; hue comes only from screenshots, palette swatches and the small category dots.

**The One Ink Rule.** There is a single dark ink for text, selected states and primary actions. A second accent colour is not introduced for emphasis.

## Typography

**Display Font:** Instrument Serif (with Georgia, serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Mono Font:** JetBrains Mono (with ui-monospace), used for prompts, code chips and swatch hex values; labels use Inter.

**Character:** An editorial serif for names and an invisible sans for everything else. Titles are regular weight with slightly tight tracking, so they read as a catalogue of names. Metadata is set in small uppercase tracked sans, which makes it recede.

### Hierarchy
- **Display** (400, clamp(30px, 4.2vw, 46px), 1.02): the page title, with "Library" in italic Soft Ink.
- **Headline** (400, clamp(28px, 3.4vw, 40px), 1.08): the style name in the detail modal.
- **Title** (400, 25px, 1.14): the style name on each card.
- **Body** (400, 15px, 1.6): descriptions; the modal long text runs at 14.5px and 1.72 line height.
- **Label** (600 at 11.5px, 0.09em tracking, uppercase): section heads in the modal, category lines, result count. The masthead sub-line is the same style at 500.

### Named Rules
**The Serif Names Rule.** Serif is for names and the page title only. Descriptions, controls and metadata stay in the sans.

## Layout

A single centred column capped at 1500px with 28px side gutters. The masthead puts title and tools (search, theme toggle) on one row that wraps on narrow screens. A sticky, blurred filter bar sits under it and scrolls sideways with edge fades when chips overflow. Cards sit in a grid of three columns, two at 1080px and below, one at 680px and below, with 30px gaps (24px on mobile). The detail modal is up to 1120px wide, with the screenshot on top (scrollable, up to 56vh) and a two-column text area beneath (1.45fr and 1fr, one column under 860px). Spacing is ad hoc rather than a strict scale, and clusters around 6, 10, 18 and 30px.

## Elevation & Depth

Hybrid: hairline borders carry structure, and one soft shadow adds lift. Cards rest with a small shadow and rise 4px with a larger shadow on hover. The modal uses the large shadow over a blurred, darkened scrim, and the filter bar uses a translucent blurred background rather than a shadow.

### Shadow Vocabulary
- **Rest** (`box-shadow: 0 1px 2px rgba(20,19,15,.05), 0 12px 28px -18px rgba(20,19,15,.35)`): cards at rest.
- **Lifted** (`box-shadow: 0 24px 70px -20px rgba(20,19,15,.42)`): hovered cards, the modal panel and the toast.

### Named Rules
**The Hover-Lift Rule.** Elevation changes only in response to pointer state; at rest the page is nearly flat.

## Shapes

Soft and pill-based. Controls (buttons, chips, tags, search, category dots) are fully rounded (999px). Surfaces step through 9px (swatches), 12px (prompt box), 14px (cards) and 18px (the modal). Images are cropped to the top of the screenshot (`object-position: top center`) in a 4:3 frame. Borders are 1px hairlines; the prompt box and the "+N more" tag use a dashed border to signal an overflow or a note.

## Components

### Buttons
- **Shape:** pill (999px), 10px by 20px padding, 13.5px weight 500.
- **Primary:** Library Ink fill with Warm Paper text ("Copy brief", "Copy image prompt").
- **Default:** Card White fill, Strong Hairline border ("Close").
- **Hover / Focus:** the primary lightens to Soft Ink; the default darkens to Deep Paper with a stronger border. Active presses down 1px. After a copy, the button turns Copied Green.
- **Icon button:** a 40px circle; the theme toggle rotates 180 degrees on hover.

### Chips
- **Style:** pill, Card White with a Hairline border, Soft Ink text, a category dot and a tabular count.
- **State:** selected chips invert to Library Ink with Warm Paper text. Hover strengthens the border.

### Tags
- **Style:** small pill (11.5px) on Deep Paper with a Hairline border. A dashed transparent variant reads "+N more".

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** Card White, with a Hairline border and a Deep Paper image area separated by a rule.
- **Shadow Strategy:** Rest, then Lifted with a 4px rise on hover; the screenshot zooms 3.5%.
- **Internal Padding:** 20px 22px; the category line sits at the bottom behind a top rule.
- **Flags:** a pill in Draft Orange on unclassified cards; a neutral outlined pill when there is no image.

### Inputs / Fields
- **Style:** pill search field with a leading magnifier, Card White, Hairline border, and an inline clear button.
- **Focus:** the border shifts to Faint Ink and a 3px ring of 8% ink appears.

### Navigation
- **Style:** a sticky chip bar with a blurred translucent ground and a bottom rule, draggable and edge-faded. There is no other navigation; the page title is plain text.

### Detail Modal
Centred panel with a scrim, a pop-in animation (220ms) and a 36px circular close button. It holds the screenshot, an eyebrow with category dot, a serif title, a lede, a long description, a palette of swatch tiles with hex labels, a traits list and a mono prompt box, over an action bar in Warm Card.

## Do's and Don'ts

### Do:
- **Do** keep chrome neutral and let screenshots and swatches provide colour.
- **Do** use Instrument Serif only for the page title and style names.
- **Do** define every colour as a CSS variable in `:root`, and redefine it for `prefers-color-scheme: dark` and `[data-theme="dark"]`.
- **Do** keep light and dark both fully designed.
- **Do** respect `prefers-reduced-motion` for entrance and hover motion.

### Don't:
- **Don't** introduce a second accent colour for emphasis; selection is expressed by inverting to ink.
- **Don't** use a template SaaS look: gradient heroes, feature-card rows, stock marketing patterns. This is a confirmed visual anti-reference.
- **Don't** treat the current look as the target of the redesign; it is recorded as the incumbent baseline.
- **Don't** load anything external except Google Fonts, and don't add a build step or dependency (see PRODUCT.md).
