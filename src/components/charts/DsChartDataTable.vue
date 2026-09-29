<script setup>
// DsChartDataTable — the accessible alternative to every chart.
// Rendered visually hidden beside each chart for screen readers, and shown
// visibly when a chart's `view` is 'table' (the card's Chart/Table toggle).
// Missing values read "No data" — never 0.
import { computed } from 'vue'
import { formatValue, formatLabel, isMissing } from './chartFormat.js'

const props = defineProps({
  caption: { type: String, default: '' },
  labels: { type: Array, default: () => [] },
  /** `{ key, label, data }[]` */
  series: { type: Array, default: () => [] },
  labelFormat: { type: String, default: 'category' },
  valueFormat: { type: String, default: 'number' },
  currency: { type: String, default: 'USD' },
  /** Header for the category column. */
  categoryHeader: { type: String, default: 'Category' },
  visuallyHidden: { type: Boolean, default: false },
  maxHeight: { type: Number, default: 0 },
})

const rows = computed(() => props.labels.map((l, i) => ({
  key: l + '-' + i,
  label: formatLabel(l, props.labelFormat, { long: true }),
  cells: props.series.map((s) => ({ key: s.key, missing: isMissing(s.data?.[i]), text: formatValue(s.data?.[i], props.valueFormat, { currency: props.currency }) })),
})))
</script>

<template>
  <div
    class="dscdt" :class="{ 'dscdt--sr': visuallyHidden }"
    :style="maxHeight && !visuallyHidden ? { maxHeight: maxHeight + 'px' } : null"
    :tabindex="visuallyHidden ? undefined : 0"
  >
    <table>
      <caption v-if="caption">{{ caption }}</caption>
      <thead>
        <tr>
          <th scope="col">{{ categoryHeader }}</th>
          <th v-for="s in series" :key="s.key" scope="col" class="num">{{ s.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in rows" :key="r.key">
          <th scope="row">{{ r.label }}</th>
          <td v-for="c in r.cells" :key="c.key" class="num" :class="{ 'is-missing': c.missing }">
            <template v-if="c.missing">No data</template><template v-else>{{ c.text }}</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.dscdt { overflow: auto; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-md); }
.dscdt:focus-visible { outline: 2px solid var(--ds-color-border-focused); }
.dscdt--sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
table { width: 100%; border-collapse: collapse; font-size: var(--ds-font-size-sm); color: var(--ds-color-text); }
caption { text-align: left; padding: 8px 12px; color: var(--ds-color-text-subtle); caption-side: top; }
th, td { padding: 8px 12px; border-bottom: 1px solid var(--ds-color-border); text-align: left; white-space: nowrap; }
thead th { position: sticky; top: 0; background: var(--ds-color-surface-sunken); font-weight: var(--ds-font-weight-bold); }
tbody th { font-weight: var(--ds-font-weight-regular); }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.is-missing { color: var(--ds-color-text-subtle); font-style: italic; }
tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }
</style>
