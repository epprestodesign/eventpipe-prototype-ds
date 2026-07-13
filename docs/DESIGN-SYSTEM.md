# Eventpipe Design System — Architecture

Design system for **EventPipe** — the platform for managing **event hotel room
blocks** (events, pickup, reporting, communications, and admin). A themed Quasar
component library, documented and QA'd in Storybook, spanning the mobile/web admin
app and host/admin surfaces. Stack: Vue 3 · Quasar · Storybook · Vite.

## Information architecture (Storybook sidebar)

Order is enforced via `options.storySort` in `.storybook/preview.js`.

```
Getting Started   Introduction · Architecture & Conventions · Components → Overview
Foundations       Palette · Colors · Typography · Icons · Logos · Imagery ·
                  Elevation · Spacing · Border Radius · Breakpoints · Motion
Components        (Polaris-style, grouped by function)
  Actions         Button · Button Group · Link · Dropdown · Menu · Popover · Modal · Dialog · Backdrop · Side Panel
  Navigation      Breadcrumbs · Tabs · Pagination · Stepper · Search
  Forms           Form Field · Input (Number/Payment/Date/File/Tags/Group) · Pin Input · Text Field · Text Area ·
                  URL Field · Search · Autocomplete · Select · Multi-Select · Time Picker · Date Picker ·
                  Checkbox · Checkbox Tree · Radio Group · Switch · Choice Chips · Slider · Range ·
                  Transfer List · File Upload · Rating
  Feedback & Status  Badge · Badge Group · Status · Alert · Banner · Progress · Skeleton ·
                     Loading Indicator · Loading States · Snackbar · Toast · Empty States
  Layout & Structure Box · Container · Grid · Stack · Divider · Table · Card · Card Headers ·
                     Accordion · Section Header · List · List Item · Info Grid · Stat
  Media & Visuals    Avatar · Icon · Thumbnail · Image List · Carousel
  Typography & Content  Text · Heading · Paragraph · Chip · Tooltip
App Chrome        App Bar · App Shell · Page Header · Save Bar
Account           Log in · Sign up · Forgot password · Verification
Pages             01 Users · 02 Events · 03 Pickup Reports · 04 Reports · 05 Hotels · 06 Hotel Brands ·
                  07 Amenities · 08 Room Types · 09 Venues · 10 Event Companies · 11 Companies ·
                  12 Requests · 14 Admin Tools · 15 Pipe Tools · 16 Webhooks · 17 Company Settings
Design Requests   🟢 DES-207 Communications | Email Template Editor (+ its components)
```

## Brand & tokens

| Token | Value | Role |
| --- | --- | --- |
| Primary (brand) | **Azure `#2561FA`** | Actions, links, selected states |
| Neutrals | **Graphite** ramps | Text, borders, surfaces |
| App chrome | **EventPipe navy `#01113E`** | Sidebar / app bar |
| Accent | **Green `#15AEB3`** | Logo / highlights |
| Font | **Product Sans** (system fallback stack) | All type |
| Radius | **4px** uniform | Cards, inputs, buttons |
| Control height | **40px** | Buttons + single-line fields |

Tokens are CSS custom properties (`--ds-*`), generated through a 3-tier pipeline:
`ds-palette.scss` (primitives) → `ds-color-tokens.scss` (semantic roles) →
`quasar.variables.scss` (Quasar bridge). See **Foundations → Palette / Colors**.

## Naming convention

| Thing | Convention | Example |
| --- | --- | --- |
| Story title | `Section/Group/Component` (Components use a function group) | `Components/Forms/Input` |
| Story file | `src/stories/<category>/<Component>.stories.js` | `inputs/Input.stories.js` |
| Primitive component | `Ds` + PascalCase | `DsField`, `DsModal` |
| Component file | `src/components/<DsX>.vue` (flat) | `src/components/DsField.vue` |
| Composable | `use` + PascalCase | `useSnackbar` |
| Token (CSS var) | `--ds-<group>-<step>` | `--ds-space-4` |
| Story export | `Default`, `Variants`, `States`, `Sizes`, … | — |

## Strategy

- **Tokens first.** Every component is themed through `--ds-*` tokens; changing the
  brand in one place reskins the whole library.
- **`Ds*` primitives.** Reusable components are Vue 3 SFCs (`<script setup>`)
  prefixed `Ds*`, living flat in `src/components/`. They wrap Quasar where useful
  (stable API, a11y, constrained props) or are custom where Quasar has no
  equivalent (`DsStat`, `DsInfoGrid`, `DsSaveBar`, …).
- **Overlays are primitives.** `DsModal` (centered dialog) and `DsSidePanel`
  (slide-over) own all overlay chrome — don't hand-roll it.
- **Forms are label-above.** Inputs compose into `DsField`; 40px control height is
  applied globally in `app.scss`.
- **Composables over ad-hoc plugin calls** where a pattern repeats (Notify, Dialog,
  Loading are registered globally in `preview.js`).

## Folder structure

```
src/
  components/      Ds* primitives (flat) + AppBar.vue · AppShell.vue
  lib/             amenities.js · imagery.js · paymentLogos.js · googleMaps.js · unsplash.js
  css/             ds-palette.scss · ds-color-tokens.scss · tokens.scss ·
                   quasar.variables.scss · typography.scss · app.scss
  stories/
    foundations/ actions/ navigation/ inputs/ feedback/ layout/ media/ typography/
    appchrome/ account/ pages/ design-requests/ patterns/
    Introduction.mdx · Architecture.mdx · ComponentsOverview.mdx
.storybook/        preview.js (storySort, Quasar setup) · manager.js
docs/              DESIGN-SYSTEM.md · UNSPLASH.md · story-template.js
```

> Note: a story's **sidebar placement comes from its `title`**, not its folder —
> e.g. `inputs/Input.stories.js` renders under `Components/Forms/Input`.

See the README for local dev, imagery, and deployment details.
