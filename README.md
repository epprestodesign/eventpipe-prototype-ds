# Presto DS

A **Quasar + Vue 3 design system**, documented and QA'd in **Storybook**, themed
for a consumer **hotel booking & reservation** experience ("Presto Design System").

- **Stack:** Vue 3 · Quasar 2 · Storybook 8 · Vite 6 · pnpm
- **Font:** PT Sans
- **Color system:** Tailwind-based 3-tier tokens (primitives → semantic → Quasar
  bridge), brand = **Navy** (#01113E), neutrals = **Slate**.

## Live docs
Storybook is published to GitHub Pages on every push to `main`:

**https://epprestodesign.github.io/presto-2026/**

## Local development
```bash
pnpm install
pnpm storybook          # dev gallery at http://localhost:6006
pnpm build-storybook    # static build → storybook-static/
```

## Architecture
| Layer | File(s) | Purpose |
| --- | --- | --- |
| Primitives | `src/css/ds-palette.scss` | Raw Tailwind hue ramps (`--ds-palette-*`) |
| Semantic | `src/css/ds-color-tokens.scss` | Roles (`--ds-color-*`) referencing primitives |
| Utilities | `src/css/ds-utilities.scss` | `bg-ds-*` / `text-ds-*` / `border-ds-*` |
| Quasar bridge | `src/css/quasar.variables.scss` | `$primary…` so components reskin |
| Tokens | `src/css/tokens.scss` | Spacing, radius, elevation, motion |
| Type | `src/css/typography.scss` | Type scale + weights |
| Overrides | `src/css/app.scss` | Global + per-component tweaks |

Stories live in `src/stories/` organized as **Foundations · Inputs · Data
Display · Feedback · Layout · Navigation · Patterns**. Token files and the
foundation pages are generated from the palette; see the chat history / the
generator for regeneration.

## Imagery — using it in Claude prototypes

Hotel imagery lives in a **separate hosted repo** so it can be updated without
rebuilding the design system:

- **Repo:** https://github.com/epprestodesign/presto-ds-imagery
- **Manifest:** `https://epprestodesign.github.io/presto-ds-imagery/manifest.json`
- **Images:** `https://epprestodesign.github.io/presto-ds-imagery/<category>/<file>.jpg`
- **Categories:** `rooms · suites · lobby · pool · spa · dining · bar · bathroom ·
  exterior · views · destinations · guests · amenities`

> **Tell Claude (or any prototype):** "Use hotel imagery from the Presto DS imagery
> manifest at the URL above; pick by category; show the photographer `credit`."

### Option 1 — Any prototype (zero setup, recommended)
Fetch the hosted manifest at runtime and build image URLs. Works in plain JS,
React, Vue, an HTML file — anything:

```js
const BASE = 'https://epprestodesign.github.io/presto-ds-imagery'
const lib = await fetch(`${BASE}/manifest.json`).then(r => r.json())

// a specific category
const first = lib.rooms[0]               // { file, alt, credit, creditUrl }
const url   = `${BASE}/${first.file}`    // full image URL

// a random image from a category
function pickImage(category) {
  const arr = lib[category] || []
  const e = arr[Math.floor(Math.random() * arr.length)]
  return e ? { url: `${BASE}/${e.file}`, alt: e.alt, credit: e.credit, creditUrl: e.creditUrl } : null
}
// pickImage('pool').url
```
Vue/Quasar example:
```html
<q-img :src="pickImage('lobby').url" :ratio="16/9" />
```

### Option 2 — Inside this repo (use the helper)
```js
import { loadImagery, getImages, randomImage } from '@/lib/imagery.js'
const lib = await loadImagery()   // remote (VITE_IMAGERY_URL) or local fallback
getImages('rooms')                // [{ url, alt, credit, creditUrl }, ...]
randomImage('pool')?.url          // instant local-fallback pick
```
Set `VITE_IMAGERY_URL=https://epprestodesign.github.io/presto-ds-imagery` in `.env`
(see `.env.example`). Unset/offline → falls back to the committed set in
`src/assets/hotel/`.

### Option 3 — Live, on-the-fly (any query, needs an API key)
```html
<DsUnsplashImage query="hotel rooftop bar" :ratio="16/9" />
```
Requires `VITE_UNSPLASH_ACCESS_KEY` in `.env`. Best for prototypes that need an
image the curated library doesn't have yet. (Don't ship the key in a public build.)

### Add more imagery (no DS redeploy)
In the imagery repo: `node build.mjs 12` → commit → push. GitHub Pages redeploys
and prototypes / Storybook pick up the new manifest on next load.

**Attribution:** always surface the `credit` (and link `creditUrl`) where feasible —
required by the Unsplash API Guidelines.

## Deployment
Handled by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml):
builds Storybook and publishes `storybook-static/` to GitHub Pages.
**One-time:** enable Pages in repo **Settings → Pages → Build and deployment →
Source: GitHub Actions**.
