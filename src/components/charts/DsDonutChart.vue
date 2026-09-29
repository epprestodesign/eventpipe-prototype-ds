<script setup>
// DsDonutChart — part-to-whole for a SMALL number of parts (2–5). Beyond
// `maxSegments` the smallest parts fold into "Other" rather than inventing a
// sixth hue. The centre metric is HTML (theme-aware, readable by screen
// readers), not canvas text.
//
// Missing segments (value null) are listed in the legend as "No data" and
// excluded from the ring — they are not zero-width slices. When every
// reported value is zero the ring is drawn as an empty track, because there
// is no composition to show.
import { ref, computed, watch, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { createChart } from './internal/chartjs.js'
import { useChartTheme } from './chartTheme.js'
import { formatValue } from './chartFormat.js'
import { classifySegments, foldSegments, sumPresent, MAX_CATEGORICAL } from './chartData.js'
import DsChartLegend from './DsChartLegend.vue'
import DsChartTooltip from './DsChartTooltip.vue'
import DsChartState from './DsChartState.vue'
import DsChartDataTable from './DsChartDataTable.vue'

const props = defineProps({
  /** `{ key, label, value: number|null }[]` — non-negative values. */
  segments: { type: Array, default: () => [] },
  /** Ring diameter in px. */
  size: { type: Number, default: 200 },
  valueFormat: { type: String, default: 'number' },
  currency: { type: String, default: 'USD' },
  /** Centre metric value (formatted string). Defaults to the formatted total. */
  centerValue: { type: String, default: undefined },
  /** Centre caption, e.g. "Total bookings". Empty hides the centre metric. */
  centerLabel: { type: String, default: '' },
  showLegend: { type: Boolean, default: true },
  /** right | bottom */
  legendPosition: { type: String, default: 'right' },
  /** Fold smaller parts into "Other" beyond this count (max 5). */
  maxSegments: { type: Number, default: MAX_CATEGORICAL },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  emptyText: { type: String, default: 'No data for this period' },
  ariaLabel: { type: String, default: '' },
  /** 'chart' | 'table' (static) | 'data' (interactive table — the card's View more modal). */
  view: { type: String, default: 'chart' },
  retryable: { type: Boolean, default: true },
})
const emit = defineEmits(['retry'])

const root = ref(null)
const canvas = ref(null)
const chart = shallowRef(null)
const { theme } = useChartTheme(root)

const info = computed(() => classifySegments(props.segments))
const status = computed(() => {
  if (props.loading) return 'loading'
  if (props.error) return 'error'
  if (info.value.empty) return 'empty'
  if (info.value.allMissing) return 'missing'
  return 'ready'
})

const folded = computed(() => foldSegments(props.segments, Math.min(props.maxSegments, MAX_CATEGORICAL)))
const total = computed(() => sumPresent(folded.value.segments.map((s) => s.value)))
const fmt = (v) => formatValue(v, props.valueFormat, { currency: props.currency })
const share = (v) => (total.value ? formatValue(v / total.value, 'percent', { decimals: 1 }) : '—')

/** Colour follows the entity: slot by position in the caller's order; Other is neutral. */
const drawn = computed(() => {
  let n = 1
  return folded.value.segments.map((s) => ({ ...s, color: s.other ? 'comparison' : `chart-${n++}` }))
})

const legendItems = computed(() => [
  ...drawn.value.map((s) => ({ key: s.key, label: s.label, color: s.color, value: fmt(s.value), detail: share(s.value) })),
  ...folded.value.missing.map((s) => ({ key: s.key, label: s.label, color: 'track', value: 'No data' })),
])

const centerText = computed(() => props.centerValue ?? fmt(total.value))
const summary = computed(() => props.ariaLabel || `Donut chart. ${props.centerLabel ? props.centerLabel + ': ' + centerText.value + '. ' : ''}` +
  drawn.value.map((s) => `${s.label} ${fmt(s.value)} (${share(s.value)})`).join(', ') + '.' +
  (folded.value.missing.length ? ` No data for ${folded.value.missing.map((s) => s.label).join(', ')}.` : ''))

const tableSeries = computed(() => [
  { key: 'value', label: 'Value', data: [...drawn.value.map((s) => s.value), ...folded.value.missing.map(() => null)] },
])
const tableLabels = computed(() => [...drawn.value.map((s) => s.label), ...folded.value.missing.map((s) => s.label)])

/* ---- tooltip ----------------------------------------------------------- */
const tip = ref({ visible: false, x: 0, y: 0, index: -1 })
const tipRows = computed(() => {
  const s = drawn.value[tip.value.index]
  if (!s) return []
  const rows = [{ key: s.key, label: s.label, color: s.color, value: fmt(s.value), detail: share(s.value) }]
  if (s.other) rows.push(...s.members.map((m) => ({ key: 'm-' + m, label: '· ' + m, color: 'comparison', value: '' })))
  return rows
})
function externalTooltip({ chart: c, tooltip }) {
  if (!tooltip || tooltip.opacity === 0 || !tooltip.dataPoints?.length || info.value.allZero) { tip.value = { ...tip.value, visible: false }; return }
  const rect = c.canvas.getBoundingClientRect()
  tip.value = { visible: true, x: rect.left + tooltip.caretX, y: rect.top + tooltip.caretY, index: tooltip.dataPoints[0].dataIndex }
}

function render() {
  if (status.value !== 'ready' || props.view !== 'chart' || !canvas.value || !theme.value) {
    if (chart.value) { chart.value.destroy(); chart.value = null }
    return
  }
  const t = theme.value
  const zero = info.value.allZero
  chart.value = createChart(canvas.value, {
    type: 'doughnut',
    data: {
      labels: zero ? ['No volume'] : drawn.value.map((s) => s.label),
      datasets: [{
        data: zero ? [1] : drawn.value.map((s) => s.value),
        backgroundColor: zero ? [t.track] : drawn.value.map((s) => t[s.color]),
        // A 2px surface ring separates adjacent slices.
        borderColor: t.surface,
        borderWidth: zero ? 0 : 2,
        hoverOffset: zero ? 0 : 4,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      cutout: '70%',
      layout: { padding: 4 },
      interaction: { mode: 'nearest', intersect: true },
      plugins: { tooltip: { enabled: false, external: externalTooltip }, legend: { display: false } },
    },
  })
}
watch([status, () => props.view, theme, () => props.segments, () => props.maxSegments, () => props.size], () => nextTick(render), { deep: true, flush: 'post' })
onBeforeUnmount(() => { chart.value?.destroy(); chart.value = null })

/* ---- keyboard: arrow through slices ------------------------------------ */
const kb = ref(-1)
function onKey(e) {
  const n = drawn.value.length
  if (!chart.value || !n || info.value.allZero) return
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') kb.value = (kb.value + 1) % n
  else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') kb.value = (kb.value - 1 + n) % n
  else if (e.key === 'Escape') { kb.value = -1; tip.value = { ...tip.value, visible: false }; chart.value.setActiveElements([]); chart.value.update('none'); return }
  else return
  e.preventDefault()
  const el = chart.value.getDatasetMeta(0).data[kb.value]
  const pos = el.tooltipPosition()
  chart.value.setActiveElements([{ datasetIndex: 0, index: kb.value }])
  chart.value.tooltip.setActiveElements([{ datasetIndex: 0, index: kb.value }], pos)
  chart.value.update('none')
}
function onBlur() { kb.value = -1; tip.value = { ...tip.value, visible: false } }
</script>

<template>
  <div ref="root" class="dsdonut">
    <ds-chart-state
      v-if="status !== 'ready'" :state="status" :height="size" :retryable="retryable"
      :message="status === 'error' ? error : status === 'empty' ? emptyText : status === 'missing' ? 'No segment has a reported value. This is not the same as zero.' : ''"
      @retry="emit('retry')"
    />
    <ds-chart-data-table
      v-else-if="view === 'table' || view === 'data'" :interactive="view === 'data'" :labels="tableLabels" :series="tableSeries"
      :value-format="valueFormat" :currency="currency" category-header="Segment"
    />
    <div v-else class="dsdonut__layout" :class="`dsdonut__layout--${legendPosition}`">
      <div class="dsdonut__ring" :style="{ width: size + 'px', height: size + 'px' }">
        <canvas ref="canvas" role="img" :aria-label="summary" tabindex="0" @keydown="onKey" @blur="onBlur" @mouseleave="tip.visible = false"></canvas>
        <div v-if="centerLabel || centerValue !== undefined" class="dsdonut__center" aria-hidden="true">
          <div class="dsdonut__cv">{{ centerText }}</div>
          <div v-if="centerLabel" class="dsdonut__cl">{{ centerLabel }}</div>
        </div>
      </div>
      <div v-if="showLegend" class="dsdonut__legend">
        <ds-chart-legend :items="legendItems" :interactive="false" layout="column" />
        <p v-if="info.allZero" class="dsdonut__note"><q-icon name="info_outline" size="14px" /> Every segment is zero for this period.</p>
        <p v-else-if="info.hasMissing" class="dsdonut__note"><q-icon name="info_outline" size="14px" /> Segments marked “No data” are excluded — they are not zero.</p>
      </div>
      <ds-chart-data-table visually-hidden :caption="summary" :labels="tableLabels" :series="tableSeries" :value-format="valueFormat" :currency="currency" category-header="Segment" />
      <ds-chart-tooltip :visible="tip.visible" :x="tip.x" :y="tip.y" :rows="tipRows" />
    </div>
  </div>
</template>

<style scoped>
.dsdonut { position: relative; min-width: 0; color: var(--ds-color-text); }
.dsdonut__layout { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.dsdonut__layout--bottom { flex-direction: column; align-items: stretch; }
.dsdonut__layout--bottom .dsdonut__ring { align-self: center; }
.dsdonut__ring { position: relative; flex: none; max-width: 100%; }
.dsdonut__ring canvas { display: block; border-radius: 50%; }
.dsdonut__ring canvas:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 4px; }
.dsdonut__center {
  position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
  pointer-events: none; text-align: center; padding: 22%;
}
.dsdonut__cv { font-size: 1.375rem; font-weight: var(--ds-font-weight-bold); line-height: 1.15; font-variant-numeric: tabular-nums; }
.dsdonut__cl { margin-top: 2px; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
.dsdonut__legend { flex: 0 1 340px; min-width: 0; }
.dsdonut__layout--bottom .dsdonut__legend { flex: none; }
.dsdonut__note { display: flex; align-items: center; gap: 6px; margin: 10px 0 0; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
</style>
