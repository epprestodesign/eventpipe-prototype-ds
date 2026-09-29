<script setup>
// EXPERIMENTAL — research only. Unovis implementation of the Line brief for
// Components/Charts/Research/Renderer Comparison. Not a catalog component,
// not exported, and must never be imported from src/components.
//
// Same inputs as DsLineChart (labels + series with `comparison` + null for
// missing) so the comparison is like-for-like. Unovis draws SVG, so colours
// are passed as `var(--ds-color-*)` strings and follow the theme with no JS.
import { computed } from 'vue'
import VisXYContainer from '@unovis/vue/containers/xy-container'
import VisLine from '@unovis/vue/components/line'
import VisAxis from '@unovis/vue/components/axis'
import VisCrosshair from '@unovis/vue/components/crosshair'
import VisTooltip from '@unovis/vue/components/tooltip'
import DsChartLegend from '../../../components/charts/DsChartLegend.vue'
import { formatValue, formatAxisValue, formatLabel, isMissing } from '../../../components/charts/chartFormat.js'
import { seriesColorSlots } from '../../../components/charts/chartData.js'
import { slotVar } from '../../../components/charts/chartTheme.js'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  series: { type: Array, default: () => [] },
  height: { type: Number, default: 280 },
  valueFormat: { type: String, default: 'number' },
  labelFormat: { type: String, default: 'category' },
})

const slots = computed(() => seriesColorSlots(props.series))
const data = computed(() => props.labels.map((l, i) => ({ i, label: l, values: props.series.map((s) => s.data[i]) })))
// Unovis draws later lines on top; draw comparison series first so they sit behind.
const order = computed(() => props.series.map((s, i) => i).sort((a, b) => Number(!!props.series[b].comparison) - Number(!!props.series[a].comparison)))
const x = (d) => d.i
const y = computed(() => order.value.map((si) => (d) => (isMissing(d.values[si]) ? undefined : d.values[si])))
const color = computed(() => order.value.map((si) => slotVar(slots.value[si])))
// Unovis calls lineDashArray as (data, lineIndex) — it must be a function, a
// plain array would be applied to every line.
const dash = computed(() => { const d = order.value.map((si) => (props.series[si].comparison ? [5, 4] : [])); return (_data, i) => d[i] })
const legend = computed(() => props.series.map((s, i) => ({ key: s.key, label: s.label, color: slots.value[i], dashed: !!s.comparison })))

const fmt = (v) => formatValue(v, props.valueFormat)
const xTick = (i) => (Number.isInteger(i) && props.labels[i] !== undefined ? formatLabel(props.labels[i], props.labelFormat) : '')
const yTick = (v) => formatAxisValue(v, props.valueFormat)

// The crosshair tooltip is an HTML string. It uses the DS tokens inline, so
// it is theme-aware, but it is a second tooltip implementation to maintain.
const template = (d) => {
  const rows = props.series.map((s, si) => {
    const v = d.values[si]
    const val = isMissing(v) ? '<em style="color:var(--ds-color-text-subtle)">No data</em>' : `<b>${fmt(v)}</b>`
    return `<div style="display:flex;gap:8px;align-items:center;padding:2px 0"><span style="width:10px;height:10px;border-radius:4px;background:${slotVar(slots.value[si])}"></span><span style="flex:1;color:var(--ds-color-text-subtle)">${s.label}</span>${val}</div>`
  }).join('')
  return `<div style="min-width:160px"><div style="font-weight:700;margin-bottom:6px">${formatLabel(d.label, props.labelFormat, { long: true })}</div>${rows}</div>`
}
</script>

<template>
  <div class="unovis-exp">
    <ds-chart-legend v-if="series.length > 1" :items="legend" :interactive="false" style="margin-bottom:12px" />
    <!-- Zero-based like the catalog; Unovis otherwise fits the domain to the data. -->
    <vis-x-y-container :data="data" :height="height" :margin="{ top: 6, right: 8 }" :y-domain="[0, undefined]">
      <!-- Unovis smooths lines by default; the brief is straight segments. -->
      <vis-line :x="x" :y="y" :color="color" :line-dash-array="dash" :line-width="2" curve-type="linear" />
      <vis-axis type="x" :tick-format="xTick" :num-ticks="Math.min(labels.length, 12)" :grid-line="false" :tick-line="false" />
      <vis-axis type="y" :tick-format="yTick" :num-ticks="5" :domain-line="false" :tick-line="false" />
      <vis-crosshair :x="x" :y="y" :template="template" :color="color" />
      <vis-tooltip />
    </vis-x-y-container>
  </div>
</template>

<style scoped>
/* Unovis is themed through CSS variables — mapped here onto the DS tokens. */
.unovis-exp {
  --vis-font-family: inherit;
  --vis-axis-tick-label-color: var(--ds-color-text-subtle);
  --vis-axis-tick-label-font-size: 12px;
  --vis-axis-grid-color: var(--ds-color-chart-grid);
  --vis-axis-domain-color: var(--ds-color-chart-axis);
  --vis-tooltip-background-color: var(--ds-color-surface-overlay);
  --vis-tooltip-border-color: var(--ds-color-border-container);
  --vis-tooltip-text-color: var(--ds-color-text);
  --vis-tooltip-border-radius: var(--ds-radius-md);
  --vis-crosshair-line-stroke-color: var(--ds-color-chart-axis);
  --vis-crosshair-circle-stroke-color: var(--ds-color-surface);
  color: var(--ds-color-text);
  font-size: var(--ds-font-size-sm);
}
</style>
