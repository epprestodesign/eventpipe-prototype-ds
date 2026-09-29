/** Story helpers shared by the Components/Charts files. Storybook only. */
import { VALUE_FORMATS, LABEL_FORMATS } from '../../components/charts/chartFormat.js'

/** Controls for the props every cartesian chart shares. */
export const cartesianArgTypes = {
  height: { control: { type: 'range', min: 160, max: 480, step: 20 }, description: 'Plot height in px (width fills the container).' },
  valueFormat: { control: 'select', options: VALUE_FORMATS, description: 'Number formatting for axis, tooltip and table.' },
  labelFormat: { control: 'select', options: LABEL_FORMATS, description: 'How x-axis labels are formatted.' },
  currency: { control: 'text' },
  showLegend: { control: 'boolean', description: 'Legend (only rendered for 2+ series).' },
  showGrid: { control: 'boolean' },
  beginAtZero: { control: 'boolean' },
  loading: { control: 'boolean' },
  error: { control: 'text', description: 'Set a message to show the error state.' },
  emptyText: { control: 'text' },
  view: { control: 'inline-radio', options: ['chart', 'table', 'data'], description: "'table' = static table; 'data' = interactive table (search, sort, series columns) — what the Chart Card's View more modal shows." },
  maxLabelLength: { control: { type: 'number', min: 6, max: 40 } },
  labels: { control: false },
  series: { control: false },
  ariaLabel: { control: 'text' },
  retryable: { control: 'boolean' },
}

/** A "series visibility" control for a given fixture. */
export const hiddenSeriesControl = (fixture) => ({
  hiddenSeries: {
    control: 'check',
    options: fixture.series.map((s) => s.key),
    description: 'Series hidden via the legend (v-model:hidden-series).',
  },
})

/** Layout wrapper so charts get a realistic width in Canvas and Docs. */
export const frame = (inner, width = 760) => `<div style="max-width:${width}px; width:100%;">${inner}</div>`

/** The mobile frame used by every Mobile story: a 360px column. */
export const mobileFrame = (inner) => `<div style="width:360px; max-width:100%;">${inner}</div>`

/** Period select used in card headers. Visual filter control from Quasar. */
export const PERIODS = ['Last 12 months', 'September 2026']

export const DARK = { themes: { themeOverride: 'dark' } }
export const LIGHT = { themes: { themeOverride: 'light' } }
