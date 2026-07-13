# Eventpipe Design System — Architecture

Design system for **Eventpipe** — the event & group hotel booking experience,
spanning the **mobile booking app, desktop web, and host/admin surfaces**.
Stack: Vue 3 · Quasar · Storybook · Vite.

## Information architecture (Storybook sidebar)

```
Getting Started   Introduction · Story Template
Foundations       Colors · Typography · Icons · Elevation · Spacing · Border Radius · Breakpoints · Motion
Inputs            Button · Button Group · Text Field · Text Area · Select · Autocomplete ·
                  Checkbox · Radio Group · Switch · Slider · Rating · Transfer List
Data Display      Avatar · Badge · Chip · Divider · Icon · List · Table · Tooltip · Typography
Feedback          Alert · Banner · Dialog · Drawer · Snackbar · Progress · Skeleton · Backdrop
Layout            Box · Container · Grid · Stack · Image List · Section Header
Navigation        Tabs · Menu · Breadcrumbs · Pagination · Stepper · App Navigation
Patterns          Forms · Search & Filters · Empty States · Loading States · Data Tables ·
                  Dashboards · App Shell · Side Panels · Confirmation Flows
Catalog           (raw Quasar reference — removed after migration)
```

Order is enforced via `options.storySort` in `.storybook/preview.js`.

## Naming convention

| Thing | Convention | Example |
| --- | --- | --- |
| Story title | `Category/Component` (2 levels; Patterns may add a 3rd) | `Inputs/Button` |
| Story file | `src/stories/<category>/<Component>.stories.js` | `inputs/Button.stories.js` |
| Wrapper component | `Ep` + PascalCase | `EpButton` |
| Wrapper file | `src/components/<EpX>.vue` | `EpButton.vue` |
| Composable | `use` + PascalCase | `useSnackbar` |
| Token (CSS var) | `--ds-<group>-<step>` | `--ds-space-4` |
| Story export | `Basic`, `Variants`, `States`, `Sizes`, … | — |

## Strategy: hybrid (tiered)

- **Tier 1 — Native + tokens** (no wrapper): low-risk primitives themed globally.
  Divider, Icon, Avatar, Badge, Tooltip, Skeleton, Progress, Breadcrumbs.
- **Tier 2 — `Ep*` wrappers** (stable internal API, a11y, constrained props):
  Button, TextField, TextArea, Select, Autocomplete, Checkbox, RadioGroup, Switch,
  Slider, Rating, Chip, Dialog, Drawer, Tabs, Menu, Pagination, Stepper, Table.
- **Tier 3 — Custom** (no Quasar equivalent): Stack, Box, Container, SectionHeader,
  ImageList, TransferList, all Patterns.
- **Tier 4 — Composables over plugins**: `useSnackbar` (Notify), `useDialog` (Dialog),
  `useBackdrop` (Loading).

## Folder structure

```
src/
  components/      Ep* wrappers + Ds* primitives + index.js (barrel)
  composables/     useSnackbar.js · useDialog.js · useBackdrop.js
  css/             quasar.variables.scss · tokens.scss · typography.scss · app.scss
  stories/
    foundations/ inputs/ data-display/ feedback/ layout/ navigation/ patterns/
    Catalog/       (legacy raw catalog; delete at end of migration)
docs/              DESIGN-SYSTEM.md · story-template.js
```

See the chat thread / README for the full mapping audit and migration plan.
