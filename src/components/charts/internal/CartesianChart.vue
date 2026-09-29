<script setup>
// CartesianChart — INTERNAL. The one implementation behind DsLineChart,
// DsAreaChart, DsBarChart and DsStackedBarChart. Not exported as a DS
// component; the public components fix `kind` and forward the shared props.
//
// Responsibilities, in order: decide the state (loading / error / empty /
// missing / ready), resolve the theme from tokens, translate the
// renderer-agnostic props into a renderer config (chartjs.js is the only
// renderer import), and own the HTML legend, tooltip, notes and data table.
import { ref, computed, watch, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { cartesianProps } from '../cartesianProps.js'
import { createChart, activateIndex, clearActive } from './chartjs.js'
import { useChartTheme, withAlpha } from '../chartTheme.js'
import { formatValue, formatAxisValue, formatLabel, truncateLabel, isMissing } from '../chartFormat.js'
import { classifyCartesian, seriesColorSlots, toShares, extent } from '../chartData.js'
import DsChartLegend from '../DsChartLegend.vue'
import DsChartTooltip from '../DsChartTooltip.vue'
import DsChartState from '../DsChartState.vue'
import DsChartDataTable from '../DsChartDataTable.vue'

const props = defineProps({
  ...cartesianProps,
  /** line | area | bar */
  kind: { type: String, default: 'line' },
  stacked: { type: Boolean, default: false },
  horizontal: { type: Boolean, default: false },
  /** Stacked bars normalised to 100% per category. */
  percent: { type: Boolean, default: false },
})
const emit = defineEmits(['update:hiddenSeries', 'retry'])

const root = ref(null)
const canvas = ref(null)
const chart = shallowRef(null)
const { theme } = useChartTheme(root)

/* ---- state ------------------------------------------------------------- */
const info = computed(() => classifyCartesian(props.labels, props.series))
const status = computed(() => {
  if (props.loading) return 'loading'
  if (props.error) return 'error'
  if (info.value.empty) return 'empty'
  if (info.value.allMissing) return 'missing'
  return 'ready'
})

const hidden = ref([...props.hiddenSeries])
watch(() => props.hiddenSeries, (v) => { hidden.value = [...v] })
function toggle(key) {
  const next = hidden.value.includes(key) ? hidden.value.filter((k) => k !== key) : [...hidden.value, key]
  // Never let the legend hide the last visible series — an empty plot reads as broken.
  if (next.length >= props.series.length) return
  hidden.value = next
  emit('update:hiddenSeries', next)
}

const slots = computed(() => seriesColorSlots(props.series))
/** The values actually plotted (shares when `percent`). */
const plotted = computed(() => (props.percent ? toShares(props.labels, props.series) : props.series))
const plotFormat = computed(() => (props.percent ? 'percent' : props.valueFormat))

const legendItems = computed(() => props.series.map((s, i) => ({
  key: s.key, label: s.label, color: slots.value[i], dashed: !!s.comparison && props.kind === 'line',
})))
const showLegend = computed(() => props.showLegend && props.series.length > 1)

/* ---- notes under the plot ---------------------------------------------- */
const notes = computed(() => {
  const out = []
  if (info.value.allZero) out.push('Every reported value in this period is zero.')
  else if (info.value.hasMissing) {
    out.push(props.kind === 'bar'
      ? 'Missing values draw no bar and read “No data” — they are not zero.'
      : 'Gaps mark points with no reported data — they are not zero.')
  }
  if (props.percent && !info.value.allZero) {
    const noTotal = props.labels.filter((_, i) => plotted.value.every((s) => s.data[i] === null))
    if (noTotal.length) out.push(`No composition for ${noTotal.map((l) => formatLabel(l, props.labelFormat)).join(', ')} — nothing was reported or every part is zero.`)
  }
  return out
})

/* ---- accessible summary ------------------------------------------------ */
const KIND_NAME = { line: 'Line chart', area: 'Area chart', bar: 'Bar chart' }
const summary = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  const kind = props.percent ? 'Stacked percentage bar chart' : props.stacked ? `Stacked ${KIND_NAME[props.kind].toLowerCase()}` : KIND_NAME[props.kind]
  const first = formatLabel(props.labels[0], props.labelFormat, { long: true })
  const last = formatLabel(props.labels[props.labels.length - 1], props.labelFormat, { long: true })
  const parts = props.series.map((s) => {
    const e = extent(s.data || [])
    return e ? `${s.label}: from ${formatValue(e.min, props.valueFormat, { currency: props.currency })} to ${formatValue(e.max, props.valueFormat, { currency: props.currency })}` : `${s.label}: no data`
  })
  return `${kind}, ${props.labels.length} points from ${first} to ${last}. ${parts.join('. ')}. Data table follows.`
})

/* ---- tooltip ----------------------------------------------------------- */
const tip = ref({ visible: false, x: 0, y: 0, index: -1 })
const tipTitle = computed(() => (tip.value.index < 0 ? '' : formatLabel(props.labels[tip.value.index], props.labelFormat, { long: true })))
const tipRows = computed(() => {
  const i = tip.value.index
  if (i < 0) return []
  return props.series
    .map((s, si) => ({ s, si }))
    .filter(({ s }) => !hidden.value.includes(s.key))
    .map(({ s, si }) => {
      const raw = s.data?.[i]
      const missing = isMissing(raw)
      const row = { key: s.key, label: s.label, color: slots.value[si], dashed: !!s.comparison && props.kind === 'line', missing }
      if (props.percent) {
        row.value = formatValue(plotted.value[si].data[i], 'percent')
        row.detail = formatValue(raw, props.valueFormat, { currency: props.currency })
      } else {
        row.value = formatValue(raw, props.valueFormat, { currency: props.currency })
      }
      return row
    })
})

function externalTooltip({ chart: c, tooltip }) {
  if (!tooltip || tooltip.opacity === 0 || !tooltip.dataPoints?.length) { tip.value = { ...tip.value, visible: false }; return }
  const rect = c.canvas.getBoundingClientRect()
  tip.value = { visible: true, x: rect.left + tooltip.caretX, y: rect.top + tooltip.caretY, index: tooltip.dataPoints[0].dataIndex }
}

/* ---- renderer config --------------------------------------------------- */
function buildConfig(t) {
  const isBar = props.kind === 'bar'
  const isArea = props.kind === 'area'
  const stacked = props.stacked || props.percent
  const color = (i) => t[slots.value[i]] || t.comparison

  const datasets = plotted.value.map((s, i) => {
    const c = color(i)
    const base = {
      label: s.label,
      data: s.data.slice(0, props.labels.length),
      hidden: hidden.value.includes(s.key),
      borderColor: c,
      backgroundColor: c,
    }
    if (isBar) {
      return {
        ...base,
        type: 'bar',
        // A 1px surface stroke gives stacked segments a 2px gap between them;
        // plain bars get a 4px rounded data end instead.
        borderColor: t.surface,
        borderWidth: stacked ? 1 : 0,
        borderRadius: stacked ? 0 : 4,
        borderSkipped: 'start',
        maxBarThickness: props.horizontal ? 22 : 36,
        categoryPercentage: 0.72,
        barPercentage: plotted.value.length > 1 && !stacked ? 0.92 : 1,
        stack: stacked ? 'total' : undefined,
      }
    }
    // line / area. Isolated points (both neighbours missing) get a visible
    // dot — otherwise a single reported value between gaps would vanish.
    const data = base.data
    const isolated = data.map((v, j) => !isMissing(v) && isMissing(data[j - 1]) && isMissing(data[j + 1]))
    return {
      ...base,
      type: 'line',
      borderWidth: 2,
      borderDash: s.comparison ? [5, 4] : [],
      backgroundColor: isArea ? withAlpha(c, stacked ? 0.5 : 0.14) : c,
      fill: isArea ? (stacked ? 'stack' : 'origin') : false,
      tension: 0,
      spanGaps: false,
      pointRadius: data.map((_, j) => (isolated[j] ? 3.5 : 0)),
      pointHoverRadius: 5,
      pointBackgroundColor: c,
      pointBorderColor: t.surface,
      pointHoverBorderColor: t.surface,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 2,
      stack: stacked ? 'total' : undefined,
      order: s.comparison ? 10 : i, // comparison draws behind
    }
  })

  const font = { family: t.fontFamily, size: 12 }
  const catAxis = {
    type: 'category',
    stacked,
    grid: { display: false, drawTicks: false },
    border: { color: t.axis },
    ticks: {
      color: t.textSubtle, font, padding: 8, maxRotation: 0,
      // Every bar keeps its label (truncated if needed); time axes thin out.
      autoSkip: !isBar, autoSkipPadding: 16,
      callback(_v, i) {
        let max = props.maxLabelLength
        // Vertical bars show every label, so fit each one to its slot width
        // (~7px per character at 12px) instead of letting them collide.
        if (isBar && !props.horizontal) {
          const slot = (this.chart.chartArea?.width || this.chart.width) / Math.max(1, props.labels.length)
          max = Math.max(4, Math.min(max, Math.floor(slot / 7)))
        }
        return truncateLabel(formatLabel(props.labels[i], props.labelFormat), max)
      },
    },
  }
  const valAxis = {
    type: 'linear',
    stacked,
    beginAtZero: props.beginAtZero,
    grid: { display: props.showGrid, color: t.grid, drawTicks: false },
    border: { display: false },
    ticks: {
      color: t.textSubtle, font, padding: 8, maxTicksLimit: 6,
      callback: (v) => formatAxisValue(v, plotFormat.value, { currency: props.currency }),
    },
  }
  if (props.percent) Object.assign(valAxis, { min: 0, max: 1 })
  // All values zero: pin the axis so the zero line sits on the baseline with a
  // readable scale, instead of Chart.js' default -1..1.
  // Only the zero tick is labelled: any other value on the axis would be invented.
  if (info.value.allZero && !props.percent) {
    Object.assign(valAxis, { min: 0, max: 1 })
    Object.assign(valAxis.ticks, { count: 2, callback: (v) => (v === 0 ? formatAxisValue(0, plotFormat.value, { currency: props.currency }) : '') })
  }

  return {
    type: isBar ? 'bar' : 'line',
    data: { labels: props.labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      indexAxis: props.horizontal ? 'y' : 'x',
      layout: { padding: { top: 6, right: 8 } },
      interaction: { mode: 'index', intersect: false, axis: props.horizontal ? 'y' : 'x' },
      scales: props.horizontal ? { y: catAxis, x: valAxis } : { x: catAxis, y: valAxis },
      plugins: { tooltip: { enabled: false, external: externalTooltip }, legend: { display: false } },
    },
  }
}

function render() {
  if (status.value !== 'ready' || props.view !== 'chart' || !canvas.value || !theme.value) {
    if (chart.value) { chart.value.destroy(); chart.value = null }
    return
  }
  chart.value = createChart(canvas.value, buildConfig(theme.value))
}

watch(
  [status, () => props.view, theme, () => props.series, () => props.labels, hidden,
    () => props.valueFormat, () => props.labelFormat, () => props.showGrid, () => props.beginAtZero,
    () => props.horizontal, () => props.stacked, () => props.percent, () => props.maxLabelLength, () => props.height],
  () => nextTick(render),
  { deep: true, flush: 'post' },
)
onBeforeUnmount(() => { chart.value?.destroy(); chart.value = null })

/* ---- keyboard ---------------------------------------------------------- */
const kbIndex = ref(-1)
function onKey(e) {
  const n = props.labels.length
  if (!chart.value || !n) return
  const fwd = props.horizontal ? 'ArrowDown' : 'ArrowRight'
  const back = props.horizontal ? 'ArrowUp' : 'ArrowLeft'
  let i = kbIndex.value
  if (e.key === fwd) i = Math.min(n - 1, i + 1)
  else if (e.key === back) i = Math.max(0, i < 0 ? 0 : i - 1)
  else if (e.key === 'Home') i = 0
  else if (e.key === 'End') i = n - 1
  else if (e.key === 'Escape') { kbIndex.value = -1; clearActive(chart.value); return }
  else return
  e.preventDefault()
  kbIndex.value = i
  activateIndex(chart.value, i)
}
function onBlur() { kbIndex.value = -1; if (chart.value) clearActive(chart.value); tip.value = { ...tip.value, visible: false } }
</script>

<template>
  <div ref="root" class="dscart">
    <ds-chart-legend
      v-if="showLegend && status === 'ready' && view === 'chart'"
      class="dscart__legend" :items="legendItems" :hidden="hidden" @toggle="toggle"
    />

    <ds-chart-state
      v-if="status !== 'ready'" :state="status" :height="height" :retryable="retryable"
      :message="status === 'error' ? error : status === 'empty' ? emptyText : status === 'missing' ? 'The period has no reported values. This is not the same as zero.' : ''"
      @retry="emit('retry')"
    />

    <template v-else-if="view === 'table'">
      <ds-chart-data-table
        :labels="labels" :series="series" :label-format="labelFormat"
        :value-format="valueFormat" :currency="currency" :max-height="height"
        :category-header="labelFormat === 'category' ? 'Category' : 'Date'"
      />
    </template>

    <template v-else>
      <div class="dscart__plot" :style="{ height: height + 'px' }">
        <canvas
          ref="canvas" role="img" :aria-label="summary" tabindex="0"
          @keydown="onKey" @blur="onBlur" @mouseleave="tip.visible = false"
        ></canvas>
      </div>
      <p v-for="n in notes" :key="n" class="dscart__note">
        <q-icon name="info_outline" size="14px" /> {{ n }}
      </p>
      <ds-chart-data-table
        visually-hidden :caption="summary" :labels="labels" :series="series"
        :label-format="labelFormat" :value-format="valueFormat" :currency="currency"
      />
      <ds-chart-tooltip :visible="tip.visible" :x="tip.x" :y="tip.y" :title="tipTitle" :rows="tipRows" />
    </template>
  </div>
</template>

<style scoped>
.dscart { position: relative; min-width: 0; width: 100%; color: var(--ds-color-text); }
.dscart__legend { margin-bottom: 12px; }
.dscart__plot { position: relative; width: 100%; min-width: 0; }
.dscart__plot canvas { display: block; border-radius: var(--ds-radius-sm); }
.dscart__plot canvas:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 4px; }
.dscart__note {
  display: flex; align-items: center; gap: 6px; margin: 10px 0 0;
  font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle);
}
</style>
