<script setup>
// EXPERIMENTAL — research only. Unovis grouped-bar implementation of the Bar
// brief for the Renderer Comparison. Same inputs as DsBarChart.
import { computed } from 'vue'
import VisXYContainer from '@unovis/vue/containers/xy-container'
import VisGroupedBar from '@unovis/vue/components/grouped-bar'
import VisAxis from '@unovis/vue/components/axis'
import VisTooltip from '@unovis/vue/components/tooltip'
import { GroupedBar } from '@unovis/ts'
import DsChartLegend from '../../../components/charts/DsChartLegend.vue'
import { formatValue, formatAxisValue, isMissing } from '../../../components/charts/chartFormat.js'
import { seriesColorSlots } from '../../../components/charts/chartData.js'
import { slotVar } from '../../../components/charts/chartTheme.js'

const props = defineProps({
  labels: { type: Array, default: () => [] },
  series: { type: Array, default: () => [] },
  height: { type: Number, default: 280 },
  valueFormat: { type: String, default: 'number' },
})

const slots = computed(() => seriesColorSlots(props.series))
const data = computed(() => props.labels.map((l, i) => ({ i, label: l, values: props.series.map((s) => s.data[i]) })))
const x = (d) => d.i
const y = computed(() => props.series.map((_, si) => (d) => (isMissing(d.values[si]) ? undefined : d.values[si])))
const color = computed(() => props.series.map((_, si) => slotVar(slots.value[si])))
const legend = computed(() => props.series.map((s, i) => ({ key: s.key, label: s.label, color: slots.value[i] })))
const xTick = (i) => (Number.isInteger(i) && props.labels[i] !== undefined ? props.labels[i] : '')
const yTick = (v) => formatAxisValue(v, props.valueFormat)

// Per-bar tooltip (Unovis' grouped bar tooltips attach to a single bar, not
// the whole category — a behavioural difference from the Chart.js index mode).
const triggers = {
  [GroupedBar.selectors.bar]: (d, _i, _els) => {
    const rows = props.series.map((s, si) => `<div style="display:flex;gap:8px;align-items:center;padding:2px 0"><span style="width:10px;height:10px;border-radius:4px;background:${slotVar(slots.value[si])}"></span><span style="flex:1;color:var(--ds-color-text-subtle)">${s.label}</span><b>${formatValue(d.values[si], props.valueFormat)}</b></div>`).join('')
    return `<div style="min-width:160px"><div style="font-weight:700;margin-bottom:6px">${d.label}</div>${rows}</div>`
  },
}
</script>

<template>
  <div class="unovis-exp">
    <ds-chart-legend v-if="series.length > 1" :items="legend" :interactive="false" style="margin-bottom:12px" />
    <vis-x-y-container :data="data" :height="height" :margin="{ top: 6, right: 8 }" :y-domain="[0, undefined]">
      <vis-grouped-bar :x="x" :y="y" :color="color" :rounded-corners="4" :group-padding="0.28" :bar-padding="0.08" :group-max-width="80" />
      <vis-axis type="x" :tick-format="xTick" :num-ticks="labels.length" :grid-line="false" :tick-line="false" />
      <vis-axis type="y" :tick-format="yTick" :num-ticks="5" :domain-line="false" :tick-line="false" />
      <vis-tooltip :triggers="triggers" />
    </vis-x-y-container>
  </div>
</template>

<style scoped>
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
  color: var(--ds-color-text);
  font-size: var(--ds-font-size-sm);
}
</style>
