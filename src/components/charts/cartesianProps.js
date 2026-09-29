/** The public prop API shared by DsLineChart, DsAreaChart, DsBarChart and
 *  DsStackedBarChart. Renderer-agnostic by design: nothing here is a Chart.js
 *  (or any renderer's) configuration object. */
export const cartesianProps = {
  /** X-axis categories. ISO dates (`YYYY-MM-DD`) when `labelFormat` is a date format. */
  labels: { type: Array, default: () => [] },
  /**
   * Series to plot:
   * `{ key, label, data: (number|null)[], comparison?: boolean, color?: 'chart-1'…'chart-5'|'comparison' }`.
   * `null` is MISSING (drawn as a gap) — never pass 0 for "no data".
   * `comparison: true` draws the neutral previous-period style.
   */
  series: { type: Array, default: () => [] },
  /** Plot height in px. Width always fills the container. */
  height: { type: Number, default: 280 },
  /** number | compact | currency | currency-compact | percent (percent expects ratios). */
  valueFormat: { type: String, default: 'number' },
  /** ISO 4217 code for currency formats. */
  currency: { type: String, default: 'USD' },
  /** category | day | month | month-year */
  labelFormat: { type: String, default: 'category' },
  /** Show the HTML legend (only rendered for 2+ series). */
  showLegend: { type: Boolean, default: true },
  /** Show horizontal value gridlines. */
  showGrid: { type: Boolean, default: true },
  /** Keys of series hidden via the legend. Supports `v-model:hidden-series`. */
  hiddenSeries: { type: Array, default: () => [] },
  /** Show the loading skeleton instead of the chart. */
  loading: { type: Boolean, default: false },
  /** Error message; when set, the error state replaces the chart. */
  error: { type: String, default: '' },
  /** Message for the empty state. */
  emptyText: { type: String, default: 'No data for this period' },
  /** Accessible summary. Auto-generated from the data when omitted. */
  ariaLabel: { type: String, default: '' },
  /** 'chart' | 'table' | 'data' — the table is the accessible alternative
   *  view; 'data' makes it interactive (search, sort, series columns) for
   *  DsChartCard's View more modal. */
  view: { type: String, default: 'chart' },
  /** Start the value axis at zero. */
  beginAtZero: { type: Boolean, default: true },
  /** Axis ticks truncate category labels beyond this many characters (full label in tooltip/table). */
  maxLabelLength: { type: Number, default: 16 },
  /** Emit `retry` from the error state. */
  retryable: { type: Boolean, default: true },
}
