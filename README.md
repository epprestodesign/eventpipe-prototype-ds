# Eventpipe DS

A **Quasar + Vue 3 design system**, documented and QA'd in **Storybook**, for
**EventPipe** — the admin platform for managing **event hotel room blocks** (events,
pickup, reporting, communications, and admin). A Polaris-style component library
grouped by function, its design tokens, app scaffolding, and full page compositions.

- **Stack:** Vue 3 · Quasar 2 · Storybook 10 · Vite 6 · pnpm
- **Font:** Product Sans (system-font fallback stack)
- **Brand:** primary **Azure `#2561FA`** · neutrals **Graphite** · app chrome **navy `#01113E`** · accent **green `#15AEB3`**
- **Shape:** uniform **4px** radius · **40px** standard control height
- **Color system:** 3-tier tokens (primitives → semantic → Quasar bridge)

## Live docs
Storybook is published to GitHub Pages on every push to `main`:

**https://epprestodesign.github.io/eventpipe-prototype-ds/**

## Local development
```bash
pnpm install
pnpm storybook          # dev gallery at http://localhost:6006
pnpm build-storybook    # static build → storybook-static/
```

## Design tokens & theming
A 3-tier token pipeline — change the brand in one place and every component reskins:

| Layer | File(s) | Purpose |
| --- | --- | --- |
| Primitives | `src/css/ds-palette.scss` | Raw hue ramps + the **Azure** brand ramp (`--ds-palette-*`) |
| Semantic | `src/css/ds-color-tokens.scss` | Roles (`--ds-color-*`) → primitives (brand = Azure, neutrals = Graphite) |
| Utilities | `src/css/ds-utilities.scss` | `bg-ds-*` / `text-ds-*` / `border-ds-*` helpers |
| Quasar bridge | `src/css/quasar.variables.scss` | `$primary…`, font, radius — so Quasar components reskin |
| Tokens | `src/css/tokens.scss` | Spacing, radius, elevation, motion |
| Type | `src/css/typography.scss` | Product Sans type scale + weights |
| Overrides | `src/css/app.scss` | Global + per-component tweaks (incl. the 40px control height) |

The Foundations **Palette** and **Colors** doc pages render from
`src/stories/_tokens-data.js`. After editing the SCSS tokens, regenerate it:

```bash
node scripts/gen-tokens-data.mjs
```

## Storybook structure
The sidebar is ordered the way product & design think (set in `.storybook/preview.js`
`storySort`). Top-level sections:

- **Getting Started** — Introduction, Architecture & Conventions, Components Overview.
- **Foundations** — tokens made visible: Palette, Colors, Typography, Icons, Logos,
  Imagery, Elevation, Spacing, Border Radius, Breakpoints, Motion.
- **Components** — the reusable library, grouped by **function** (Polaris-style):
  Actions · Navigation · Forms · Feedback & Status · Layout & Structure ·
  Media & Visuals · Typography & Content.
- **App Chrome** — full-screen scaffolds: App Bar, App Shell, Page Header, Save Bar.
- **Account** — auth surfaces: Log in, Sign up, Forgot password, Verification.
- **Pages** — complete admin screens composed from the library: Users, Events,
  Pickup Reports, Reports, Hotels, Hotel Brands, Amenities, Room Types, Venues,
  Event Companies, Companies, Requests, Admin Tools, Pipe Tools, Webhooks,
  Company Settings.
- **Design Requests** — ticket-scoped design work (currently DES-207,
  Communications | Email Template Editor).

> A story's sidebar placement comes from its `title` (e.g. `Components/Forms/Input`),
> not its source folder.

## Imagery — using it in Claude prototypes

Hotel imagery lives in a **separate hosted repo** so it can be updated without
rebuilding the design system:

- **Repo:** https://github.com/epprestodesign/presto-ds-imagery
- **Manifest:** `https://epprestodesign.github.io/presto-ds-imagery/manifest.json`
- **Images:** `https://epprestodesign.github.io/presto-ds-imagery/<category>/<file>.jpg`
- **Categories:** `rooms · suites · lobby · pool · spa · dining · bar · bathroom ·
  exterior · views · destinations · guests · amenities`

> **Tell Claude (or any prototype):** "Use hotel imagery from the hosted imagery
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
Handled by [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): builds
Storybook and publishes `storybook-static/` to GitHub Pages on every push to
`main`. Pages is already enabled (**Settings → Pages → Source: GitHub Actions**).
