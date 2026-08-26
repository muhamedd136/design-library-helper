# Working in this repo

A static, zero-dependency web app that catalogues web design languages.
See `README.md` for how a human uses it.

## Layout

- `resources/` — reference screenshots. The user adds these; never delete them.
- `data/styles.json` — **source of truth**: `categories[]` + `styles[]`.
- `data/styles.js` — **generated**. Never hand-edit. Produced by `scripts/sync.mjs`.
- `scripts/sync.mjs` — scans `resources/`, appends drafts, regenerates `styles.js`.
- `scripts/serve.mjs` — static server (`npm start`, port 4321) that syncs on request.
- `index.html`, `assets/app.css`, `assets/app.js` — the app.

After any edit to `data/styles.json`, run:

```bash
npm run sync
```

## The recurring task: "classify the drafts"

When the user drops new screenshots into `resources/` and asks you to classify
them, this is the job:

1. `npm run sync` — new files become entries with `"draft": true` and
   `"category": "unsorted"`.
2. Read each drafted image (`Read` on the file path). If a file is larger than
   2000px in either dimension the Read tool fails — make a resized copy first:
   `sips -Z 1800 <file> --out <scratchpad>/<file>`.
3. Rewrite each draft entry in place with: a real `id` (kebab-case slug of the
   title), `title`, `category` (an existing `categories[].id`), `short`, `long`,
   `keywords`, `palette`, `traits`, `prompt` — then **delete the `draft` key**.
4. `npm run sync` and confirm `0 draft(s)`.

### House style for entries

- `short` — one sentence, ~20 words, describes what you'd *see*.
- `long` — 2–4 sentences. Say how the style works mechanically (what the type
  does, what the shadows do, why the grid is built that way), not just adjectives.
- `keywords` — 6–8 lowercase noun phrases, concrete and searchable
  ("dual shadow", "arch mask", "ghost numerals"), not vague ("modern", "clean").
- `palette` — 4–5 hex values, ground colour first.
- `traits` — exactly the keys `Typography`, `Layout`, `Colour`, `Motion`.
- `prompt` — one long comma-delimited paragraph describing a **website
  screenshot** in that style, ending with `1440px desktop viewport` (or
  `1440px viewport` for poster-format styles). Name specific type
  classifications, layout mechanics and colours; don't name real brands.

Match the voice of the existing entries: plain, specific, no marketing language,
no em-dash-heavy prose, no "elevate" / "seamless" / "stunning".

## Constraints

- No build step, no dependencies, no framework. Plain HTML/CSS/JS, Node 18+.
- The page must keep working from `file://` — that's why data ships as
  `window.DESIGN_LIBRARY` in a `<script>` rather than a `fetch()` of JSON.
- Only Google Fonts is loaded externally; keep everything else local.
- Light and dark are both first-class; every colour comes from a CSS variable
  defined in `:root`, redefined under `@media (prefers-color-scheme: dark)` and
  `:root[data-theme="dark"]`.
