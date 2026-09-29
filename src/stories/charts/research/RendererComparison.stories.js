/** COMPONENTS / Charts / Research / Renderer Comparison — EXPERIMENTAL.
 *
 *  B (standardized Chart.js = the catalog components) vs C (Unovis) on the
 *  same synthetic dataset, the same dimensions and the same visual brief.
 *  Unovis is a devDependency imported ONLY from this folder.
 */
import DsLineChart from '../../../components/charts/DsLineChart.vue'
import DsBarChart from '../../../components/charts/DsBarChart.vue'
import DsCard from '../../../components/DsCard.vue'
import UnovisLineExperiment from './UnovisLineExperiment.vue'
import UnovisBarExperiment from './UnovisBarExperiment.vue'
import { DARK } from '../_shared.js'
import { REVENUE_MONTHLY, CHECKINS_MISSING, CHANNEL_PERIODS, DENSE_DAILY } from '../fixtures/chartFixtures.js'

const BRIEF = 'Brief: DS tokens only · categorical slot 1 for the current series · neutral dashed comparison series · 2px lines · recessive grid · compact currency axis · tooltip with every series, "No data" for gaps · missing values as gaps · 280px plot height, container width.'

export default {
  title: 'Components/Charts/Research/Renderer Comparison',
  tags: ['autodocs', 'experimental'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
> **EXPERIMENTAL — research, not an approved component.** Nothing on this page is part of the catalog API. Unovis is installed as a devDependency and imported only from \`src/stories/charts/research/\`.

The same synthetic dataset, dimensions and visual brief rendered three ways:

- **A. Original Chart.js implementation — does not exist.** Before this work the repo had no charting library at all (no \`chart.js\`, \`vue-chartjs\`, \`@unovis/*\`, \`echarts\`, \`apexcharts\` or \`d3\` in \`package.json\`). The only charts were hand-drawn inline SVG / div bars on the EP Pay screens. There is nothing to show for A.
- **B. Standardized Chart.js** — the real catalog components (\`DsLineChart\`, \`DsBarChart\`). Chart.js 4, canvas, tree-shaken registration in one internal module.
- **C. Unovis** — \`@unovis/vue\` + \`@unovis/ts\` 1.7, SVG, themed through its \`--vis-*\` CSS variables mapped onto DS tokens.

${BRIEF}

## Evidence

| Criterion | B · Chart.js | C · Unovis |
| --- | --- | --- |
| Install footprint | \`chart.js\` + 1 transitive (\`@kurkle/color\`) | **~166 lockfile packages** (d3-*, @emotion/*, leaflet, maplibre-gl, topojson, dagre, three types, babel helpers) |
| Bundle, equivalent surface (esbuild, min / gzip) | 182 KB / **63.6 KB** | 234 KB / **75.0 KB** (+ @unovis/vue wrappers) |
| Theming (light/dark) | Canvas cannot read CSS vars → colours resolved from tokens at runtime and the chart re-created on theme change (\`chartTheme.js\`) | **Native**: SVG fills accept \`var(--ds-color-*)\`; theme switch needs no JS |
| Missing data as gaps | \`spanGaps: false\`; isolated points need a custom dot rule | Gaps by default (\`interpolateMissingData: false\`); isolated single points are **not drawn** |
| Tooltip | External handler → our Vue \`DsChartTooltip\` (one component, DS tokens, viewport-clamped) | Crosshair/Tooltip \`template\` returns an **HTML string** — a second tooltip implementation to keep in sync |
| Category tooltip on grouped bars | Index mode: whole category | Per-bar trigger; whole-category needs custom work |
| Keyboard access | Not built in; added (arrow keys drive \`setActiveElements\`) | Not built in; would need an equivalent layer on SVG |
| Dense data (90+ pts) | Canvas; cheap | SVG nodes per mark; fine at this size, heavier at thousands |
| DOM/testability | Canvas pixels; accessible via our hidden table | SVG is inspectable/selectable in tests |
| Vue integration | Thin internal wrapper (ours) | Official \`@unovis/vue\` wrappers; per-component subpath imports needed to avoid the barrel |
| Maturity / hiring familiarity | Very widely used | Smaller community |

## Recommendation

**Keep standardized Chart.js (B) as the production renderer.** The catalog already hides the renderer behind a renderer-agnostic prop API, so this is a reversible decision confined to \`src/components/charts/internal/\`.

Unovis's genuine advantage — SVG that themes through CSS variables with no JavaScript — is real, but B already achieves correct theming with a small, tested resolver. Against that, C adds ~166 packages (including map and graph libraries the catalog does not use), a larger bundle for the same surface, a second (string-template) tooltip implementation, and per-bar rather than per-category tooltips. None of C's advantages is a capability B lacks.

**Revisit** if the product needs chart types Chart.js handles poorly (Sankey, chord, network graph, maps — Unovis ships these), or if SVG-level DOM testing becomes a requirement.

**Decisions needed before production migration:** see the Charts Overview → "Before production".
`,
      },
    },
  },
}

const panel = (label, tone, inner) => `
  <ds-card padding="md" style="min-width:0">
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; flex-wrap:wrap">
      <strong style="font-size:0.9375rem">${label}</strong>
      <span style="font-size:11px; font-weight:700; letter-spacing:.04em; padding:2px 6px; border-radius:4px; background:var(--ds-color-background-${tone}); color:var(--ds-color-text${tone === 'warning' ? '-warning' : ''})">${tone === 'warning' ? 'EXPERIMENTAL' : 'CATALOG'}</span>
    </div>
    ${inner}
  </ds-card>`

const grid = (b, c) => `
  <div>
    <p style="margin:0 0 12px; font-size:13px; color:var(--ds-color-text-subtle); max-width:900px">${BRIEF} All data synthetic.</p>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(420px, 1fr)); gap:16px; max-width:1200px">
      ${panel('B · Standardized Chart.js', 'neutral', b)}
      ${panel('C · Unovis', 'warning', c)}
    </div>
  </div>`

const comps = { DsLineChart, DsBarChart, DsCard, UnovisLineExperiment, UnovisBarExperiment }

/** Revenue over time, current vs previous year. */
export const LineComparison = {
  name: 'Line — B vs C',
  render: () => ({
    components: comps,
    setup: () => ({ d: REVENUE_MONTHLY }),
    template: grid(
      `<ds-line-chart :labels="d.labels" :series="d.series" value-format="currency" label-format="month" :height="280" />`,
      `<unovis-line-experiment :labels="d.labels" :series="d.series" value-format="currency" label-format="month" :height="280" />`,
    ),
  }),
}

/** Gaps, isolated values and "No data" in the tooltip. */
export const MissingDataComparison = {
  name: 'Missing Data — B vs C',
  render: () => ({
    components: comps,
    setup: () => ({ d: CHECKINS_MISSING }),
    template: grid(
      `<ds-line-chart :labels="d.labels" :series="d.series" label-format="day" :height="280" />`,
      `<unovis-line-experiment :labels="d.labels" :series="d.series" label-format="day" :height="280" />`,
    ),
  }),
}

/** Grouped bars, current vs previous period. */
export const GroupedBarComparison = {
  name: 'Grouped Bar — B vs C',
  render: () => ({
    components: comps,
    setup: () => ({ d: CHANNEL_PERIODS }),
    template: grid(
      `<ds-bar-chart :labels="d.labels" :series="d.series" :height="280" />`,
      `<unovis-bar-experiment :labels="d.labels" :series="d.series" :height="280" />`,
    ),
  }),
}

/** 90 daily points. */
export const DenseDataComparison = {
  name: 'Dense Data — B vs C',
  render: () => ({
    components: comps,
    setup: () => ({ d: DENSE_DAILY }),
    template: grid(
      `<ds-line-chart :labels="d.labels" :series="d.series" label-format="day" :height="280" />`,
      `<unovis-line-experiment :labels="d.labels" :series="d.series" label-format="day" :height="280" />`,
    ),
  }),
}

/** Both renderers under the dark theme. */
export const DarkComparison = {
  name: 'Dark — B vs C',
  parameters: DARK,
  render: () => LineComparison.render(),
}
