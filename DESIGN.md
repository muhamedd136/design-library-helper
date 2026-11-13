---
name: Design Style Library
description: A tomato-red and cream lookbook of web design languages, set in a high-contrast serif with a brush logotype.
colors:
  cream: "#f4efe4"
  cream-deep: "#e9e2d2"
  tomato: "#c53a26"
  on-tomato: "#f8f1e3"
  ink: "#1a1a1a"
  mute: "#6d675d"
  hairline: "rgba(26, 26, 26, .2)"
  hero-black: "#1a1210"
typography:
  display:
    fontFamily: "Knewave, Marker Felt, cursive"
    fontSize: "clamp(56px, 17.5vw, 290px)"
    fontWeight: 400
    lineHeight: 0.8
  backdrop:
    fontFamily: "Playfair Display, Times New Roman, serif"
    fontSize: "24vw"
    fontWeight: 500
    lineHeight: 0.86
    letterSpacing: "-0.045em"
  headline:
    fontFamily: "Playfair Display, Times New Roman, serif"
    fontSize: "clamp(36px, 4.9vw, 78px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Playfair Display, Times New Roman, serif"
    fontSize: "clamp(21px, 2.3vw, 37px)"
    fontWeight: 400
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  accent:
    fontFamily: "Playfair Display, Times New Roman, serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "DM Sans, Helvetica Neue, sans-serif"
    fontSize: "10.5px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.16em"
rounded:
  none: "0"
  pill: "999px"
spacing:
  page-gutter: "4vw"
  page-gutter-mobile: "16px"
  tile-padding: "clamp(16px, 2.2vw, 38px)"
  sheet-padding: "5vw"
  stack: "10px"
components:
  pill:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.accent}"
    rounded: "{rounded.pill}"
    padding: "7px 18px"
  button-primary:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  button-outline:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.tomato}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-outline-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
  button-close:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  category-link:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.accent}"
  category-link-selected:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.tomato}"
    typography: "{typography.accent}"
  search-input:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "6px 0 10px"
  tile-red:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile-padding}"
  tile-cream:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.tomato}"
    typography: "{typography.title}"
    rounded: "{rounded.none}"
    padding: "{spacing.tile-padding}"
  announcement-tape:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.label}"
    padding: "7px 0"
  sheet-head:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.on-tomato}"
    typography: "{typography.headline}"
    padding: "72px 5vw 40px"
  toast:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    typography: "{typography.accent}"
    rounded: "{rounded.pill}"
    padding: "11px 22px"
---

# Design System: Design Style Library

## Overview

**Creative North Star: "The Red-Letter Lookbook"**

A fashion lookbook that happens to file web design languages. Two colours do all the work: tomato red and cream, laid down as hard-edged blocks with no gutters between them. A brush-script logotype shouts once at the top over a strip of greyscale screenshots, then a high-contrast serif takes over, mixing roman and italic inside the same line. The library's own screenshots are the photography, some in colour and some in greyscale, set edge to edge with red and cream text cells in a checkerboard.

Density is high and the surface is flat. There are no cards, no shadows and no rounded panels: a style is a pair of square cells, one image and one block of text. An oversized cropped serif word sits behind the top of the mosaic and names the current category. A fine paper grain covers the whole page so the flat colour never looks like a screen fill. Light and dark share the same structure; dark swaps cream for a warm near-black and keeps the red.

The confirmed visual anti-references are: purple gradients, glossy 3D renders, untextured stock photography, rounded-everything friendliness, icon-grid feature rows, Inter or system-font-only typography, evenly distributed colourful palettes, and the template SaaS look.

**Key Characteristics:**
- Tomato red and cream as flat, hard-edged blocks; ink only for text and small controls.
- A brush logotype used once, then a serif that mixes roman and italic.
- A gutterless checkerboard mosaic of screenshot cells and text cells.
- An oversized, cropped serif word as a background layer behind the grid.
- Square corners everywhere except pill-shaped actions.
- No shadows; a paper grain overlay supplies the texture.
- Light and dark are both first-class; dark is a warm near-black, not blue-black.

## Colors

Two colours and an ink. Red and cream trade places as ground and figure; nothing else is added to the chrome.

### Primary
- **Tomato Red**: the colour blocks (announcement tape, the red intro block, every other text cell, the head of the detail sheet, the backdrop behind the sheet), all serif headings set on cream, the search underline, primary buttons and pills. Dark mode lifts it slightly (#cf4029).
- **Red-Block Cream**: text and outlines that sit on Tomato Red. Dark: #fff3e2.

### Neutral
- **Cream**: the page ground, cream text cells, the category bar. Dark: Warm Soot (#16100e).
- **Deep Cream**: the screenshot tray in the detail sheet and image placeholders. Dark: #211815.
- **Ink**: body text, the close button, the toast, search highlights, focus rings. Dark: it becomes Cream (#f4efe4).
- **Mute**: captions, counts, placeholder text, small labels. Dark: #a79d90.
- **Hairline**: 1px rules around the category bar, trait rows and image frames, drawn as 20% ink. Dark: 22% cream.
- **Hero Black**: the ground under the hero strip, behind the greyscale screenshots. It stays dark in both themes.

Category accent colours from `data/styles.json` are not used in the interface.

### Named Rules
**The Two Colours Rule.** The chrome is Tomato Red, Cream and Ink. Any other hue on screen comes from a screenshot or a palette swatch.

**The Trade Places Rule.** Red on cream and cream on red are the only two pairings. A selected or hovered control inverts to the other pairing, or to ink; it never gains a new colour.

## Typography

**Display Font:** Knewave (with Marker Felt, cursive)
**Serif Font:** Playfair Display (with Times New Roman, serif)
**Body Font:** DM Sans (with Helvetica Neue, sans-serif)

**Character:** A loud brush logotype over a composed, high-contrast serif. The serif sets tight (negative tracking, line-height at or under 1) and switches to italic mid-line for attitude; the sans stays small and plain underneath.

### Hierarchy
- **Display** (400, clamp(56px, 17.5vw, 290px), 0.8, uppercase, rotated -4deg): the hero logotype. The same face appears small in the "start typing" note and at the foot of the page, nowhere else.
- **Backdrop** (500, 24vw, 0.86, uppercase, -0.045em): the cropped category word behind the mosaic. It runs off both edges and is covered by the first row of tiles.
- **Headline** (400, clamp(36px, 4.9vw, 78px), 1.0, -0.035em): the page headline; the style name in the detail sheet uses the same voice at clamp(40px, 5.2vw, 88px) and 0.95.
- **Title** (400, clamp(21px, 2.3vw, 37px), 1.02, -0.025em): style names in the mosaic and trait names in the sheet.
- **Accent** (400 italic, 15px to 20px, 1.2): pills, the selected category, section heads in the sheet, the search field (up to 32px), keywords, the toast and the result count.
- **Body** (400, 15px, 1.5): descriptions. The long description in the sheet is 16px at 1.62 with a 62ch measure; tile descriptions drop to 12px to 14px and clamp at four lines.
- **Label** (500, 10px to 11px, 0.16em, uppercase): category lines on tiles, the search label, the announcement tape.

### Named Rules
**The Italic Last Word Rule.** A style name is set roman with its last word in italic. The page headline does the same thing by hand, italicising single letters and words. Italic is never applied to a whole heading.

**The Brush Once Rule.** The brush face belongs to the logotype and two small hand-written asides. It is never used for content, labels or controls.

## Layout

Full-bleed bands stacked with no gaps: announcement tape, hero strip, a two-part intro (38% red block, 62% cream with the headline and search), a sticky category bar, then the mosaic.

The mosaic is a two-column grid with no gutters. Each style is one tile, twice as wide as it is tall, split into two square cells: screenshot and text. The image side swaps every other row and the text cells alternate red and cream, so the page reads as a four-column checkerboard. The backdrop word sits above the grid and the grid is pulled up over its lower third (-8.5vw).

The detail sheet fills the viewport. The screenshot holds the left 5/11 as a sticky, independently scrolling tray; the text scrolls on the right, opening with a red head block and closing with a sticky action bar.

Side padding is fluid (4vw on the page, 5vw in the sheet, 16px on phones). At 1000px and below the mosaic becomes one tile per row with red and cream alternating by row, and the sheet stacks. At 620px and below the intro stacks and each tile becomes an image over text.

### Named Rules
**The No Gutter Rule.** Blocks touch. Separation comes from the change of colour or from an image edge, never from whitespace between cells.

## Elevation & Depth

Flat. There are no shadows anywhere. Depth comes from overlap: tiles cover the backdrop word, the logotype sits over the photo strip, and a small colour screenshot overlaps the edge of the intro. A fractal-noise grain overlay (13% opacity, multiply in light and screen in dark) lies over the whole page to give the flat colour a printed surface.

### Named Rules
**The Flat Paper Rule.** Nothing lifts off the page. Hover changes colour, crop or saturation, never elevation.

## Shapes

Square by default. Tiles, images, colour blocks, swatches and the sheet all have 0 radius. The one exception is the pill (999px), reserved for things you press or small count badges. Borders are 1px hairlines; the search field is an underline only (2px, 4px on focus) and the prompt carries a 3px red rule down its left edge. Screenshots are always cropped from the top (`object-position: top`). The detail sheet opens with a diagonal wipe from the bottom-left corner.

### Named Rules
**The Square Or Pill Rule.** A corner is either 0 or fully round. There are no small radii.

## Components

### Buttons
- **Shape:** pill (999px).
- **Primary:** Tomato Red fill with Red-Block Cream text, 12px by 24px padding, 13px medium sans ("Copy brief").
- **Outline:** 1px Tomato Red border and red text on the ground colour ("Copy image prompt").
- **Hover / Done:** both invert to Ink with Cream text; after a copy the label reads "Copied" for 1.4s.
- **Close:** a small Ink pill fixed to the top-right of the sheet.
- **Tile action:** a 1px outlined pill ("Read it →") at the foot of each text cell; it fills on hover with the opposite colour of its cell.

### Pills
- **Style:** Tomato Red with italic serif text and a roman figure, used for the two counts under the logotype.

### Category Links
- **Style:** plain serif text in a sticky, horizontally scrolling bar with a superscript count in the sans.
- **State:** hover turns red; the selected link is red, italic and underlined (2px, 6px offset).

### Mosaic Tiles
- **Corner Style:** square.
- **Background:** the text cell is Tomato Red or Cream in a checkerboard; cream cells carry a half-pixel inset hairline.
- **Image:** fills its cell, cropped from the top. Every third image is greyscale; hover or focus restores colour and zooms 4%.
- **Internal Padding:** clamp(16px, 2.2vw, 38px).
- **Content:** uppercase category label, serif title with an italic last word, a short description clamped to four lines, the tile action.
- **Flags:** a draft is marked in the category label; a style with no screenshot shows palette bands and a small Ink pill reading "palette only".

### Inputs / Fields
- **Style:** an underlined field with no box, italic serif text, a small uppercase label above.
- **Focus:** the underline thickens from 2px to 4px.

### Navigation
- **Style:** the category bar is the only navigation. An announcement tape above the hero scrolls continuously (60s loop) and stops under reduced motion.

### Detail Sheet
A full-viewport dialog over a red backdrop. Left: the full screenshot in a Deep Cream tray. Right: a red head block (label, serif title, italic summary), then sections headed in red italic serif: the long description, a two-column trait list under hairlines, palette bars with hex labels (the ground colour twice as wide, each bar rising on hover and copying on click), keywords as italic links separated by red slashes (a click searches for that keyword), and the image prompt behind a red left rule. A sticky bar at the bottom holds the two copy buttons.

### Toast
An Ink pill with italic serif text, centred at the bottom, shown for 1.9s.

## Do's and Don'ts

### Do:
- **Do** build with Tomato Red, Cream and Ink only, and let screenshots and swatches supply every other colour.
- **Do** set serif headings tight and put the last word of a style name in italic.
- **Do** keep blocks edge to edge with square corners; use the pill only for actions and count badges.
- **Do** mix greyscale and colour screenshots deliberately, and crop them from the top.
- **Do** keep the grain overlay on any new full-page surface.
- **Do** define every colour as a CSS variable in `:root`, and redefine it for `prefers-color-scheme: dark` and `[data-theme="dark"]`.
- **Do** respect `prefers-reduced-motion` for the tape, the logotype wipe, the sheet wipe and image zoom.

### Don't:
- **Don't** add a third chrome colour, including the per-category accents in the data.
- **Don't** use shadows, gradients, blur or small corner radii.
- **Don't** use the brush face for anything but the logotype and short hand-written asides.
- **Don't** put gutters between mosaic cells or wrap entries in cards.
- **Don't** use purple gradients, glossy 3D renders, untextured stock photography, rounded-everything friendliness, icon-grid feature rows, Inter or system-font-only typography, or evenly distributed colourful palettes. These are confirmed visual anti-references.
- **Don't** use a template SaaS look: gradient heroes, feature-card rows, stock marketing patterns.
- **Don't** load anything external except Google Fonts, and don't add a build step or dependency (see PRODUCT.md).
