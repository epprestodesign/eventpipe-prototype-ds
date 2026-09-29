<script setup>
// DsChartDataTable — the accessible alternative to every chart.
// Rendered visually hidden beside each chart for screen readers, and shown
// visibly when a chart's `view` is 'table' (static) or 'data' (interactive —
// the DsChartCard "View more" modal).
// Missing values read "No data" — never 0.
//
// `interactive` adds a toolbar (row search, show/hide series columns, a live
// "Showing N of M rows" count) and sortable column headers. The row model is
// pure and unit-tested: ./chartTable.js.
import { ref, computed, watch } from 'vue'
import { formatValue, formatLabel, isMissing } from './chartFormat.js'
import { seriesColorSlots } from './chartData.js'
import {
  CATEGORY_KEY, buildTableRows, filterTableRows, sortTableRows, nextSort, ariaSort, toggleHiddenSeries,
} from './chartTable.js'
import DsSearch from '../DsSearch.vue'
import DsChartLegend from './DsChartLegend.vue'

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
  /** Search, sortable headers and series column toggles (the View more modal).
   *  Not combinable with `visuallyHidden`; `maxHeight` is ignored — the
   *  surrounding modal scrolls, not the table. */
  interactive: { type: Boolean, default: false },
  /** Interactive only: the chart's own legend items (`{ key, label, color, dashed }`)
   *  so the column toggles match the chart's swatches. Derived from `series` if omitted. */
  legendItems: { type: Array, default: null },
})

const rows = computed(() => props.labels.map((l, i) => ({
  key: l + '-' + i,
  label: formatLabel(l, props.labelFormat, { long: true }),
  cells: props.series.map((s) => ({ key: s.key, missing: isMissing(s.data?.[i]), text: formatValue(s.data?.[i], props.valueFormat, { currency: props.currency }) })),
})))

/* ---- interactive mode -------------------------------------------------- */
const query = ref('')
const hidden = ref([])
const sort = ref(null)

const allKeys = computed(() => props.series.map((s) => s.key))
const visibleSeries = computed(() => props.series.filter((s) => !hidden.value.includes(s.key)))
const visibleKeys = computed(() => visibleSeries.value.map((s) => s.key))
const columnItems = computed(() => {
  if (props.legendItems) return props.legendItems
  const slots = seriesColorSlots(props.series)
  return props.series.map((s, i) => ({ key: s.key, label: s.label, color: slots[i] }))
})

const model = computed(() => props.interactive
  ? buildTableRows(props.labels, props.series, { labelFormat: props.labelFormat, valueFormat: props.valueFormat, currency: props.currency })
  : [])
const shown = computed(() => {
  const filtered = filterTableRows(model.value, query.value, visibleKeys.value)
  const sorted = sortTableRows(filtered, sort.value, { byIndex: props.labelFormat !== 'category' })
  const vis = new Set(visibleKeys.value)
  return sorted.map((r) => ({ ...r, cells: r.cells.filter((c) => vis.has(c.key)) }))
})
const countText = computed(() => `Showing ${shown.value.length} of ${model.value.length} ${model.value.length === 1 ? 'row' : 'rows'}`)

// Drop state that no longer applies when the data changes underneath.
watch(allKeys, (keys) => {
  hidden.value = hidden.value.filter((k) => keys.includes(k))
  if (sort.value && sort.value.key !== CATEGORY_KEY && !keys.includes(sort.value.key)) sort.value = null
})

function onToggleSeries(key) {
  hidden.value = toggleHiddenSeries(hidden.value, key, allKeys.value)
  if (sort.value && hidden.value.includes(sort.value.key)) sort.value = null
}
function onSort(key) { sort.value = nextSort(sort.value, key) }
function sortAttr(key) { const v = ariaSort(sort.value, key); return v === 'none' ? undefined : v }
function sortIcon(key) {
  const v = ariaSort(sort.value, key)
  return v === 'ascending' ? 'arrow_upward' : v === 'descending' ? 'arrow_downward' : 'unfold_more'
}
function clearSearch() { query.value = '' }

// Escape inside a search that has text clears it (DsSearch does that) and must
// not also close the surrounding modal, which listens on document.
let escClears = false
function onKeydownCapture(e) { if (e.key === 'Escape') escClears = !!query.value }
function onKeydownBubble(e) { if (e.key === 'Escape' && escClears) { e.stopPropagation(); escClears = false } }
</script>

<template>
  <div v-if="interactive" class="dscdt-x">
    <div class="dscdt-x__bar">
      <div class="dscdt-x__search" @keydown.capture="onKeydownCapture" @keydown="onKeydownBubble">
        <ds-search v-model="query" placeholder="Search rows" />
      </div>
      <p class="dscdt-x__count" role="status" aria-live="polite">{{ countText }}</p>
    </div>
    <div v-if="series.length > 1" class="dscdt-x__cols" role="group" aria-label="Show or hide columns">
      <span class="dscdt-x__cols-label" aria-hidden="true">Columns</span>
      <ds-chart-legend :items="columnItems" :hidden="hidden" @toggle="onToggleSeries" />
    </div>

    <div class="dscdt dscdt--interactive" role="region" :aria-label="caption || `${categoryHeader} data`">
      <table>
        <caption v-if="caption">{{ caption }}</caption>
        <thead>
          <tr>
            <th scope="col" :aria-sort="sortAttr(CATEGORY_KEY)">
              <button type="button" class="dscdt__sort" @click="onSort(CATEGORY_KEY)">
                {{ categoryHeader }}<q-icon :name="sortIcon(CATEGORY_KEY)" size="16px" class="dscdt__sort-icon" :class="{ 'is-active': sortAttr(CATEGORY_KEY) }" aria-hidden="true" />
              </button>
            </th>
            <th v-for="s in visibleSeries" :key="s.key" scope="col" class="num" :aria-sort="sortAttr(s.key)">
              <button type="button" class="dscdt__sort" @click="onSort(s.key)">
                {{ s.label }}<q-icon :name="sortIcon(s.key)" size="16px" class="dscdt__sort-icon" :class="{ 'is-active': sortAttr(s.key) }" aria-hidden="true" />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in shown" :key="r.key">
            <th scope="row">{{ r.label }}</th>
            <td v-for="c in r.cells" :key="c.key" class="num" :class="{ 'is-missing': c.missing }">{{ c.text }}</td>
          </tr>
          <tr v-if="!shown.length" class="dscdt__empty-row">
            <td :colspan="visibleSeries.length + 1">
              <div class="dscdt__empty">
                <span>No rows match '{{ query.trim() }}'</span>
                <q-btn flat no-caps dense color="primary" icon="close" label="Clear search" class="dscdt__clear" @click="clearSearch" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div
    v-else
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
/* The visible table matches the design system's data table, `.ds-table` in
   app.scss (user decision 2026-09-29: the expanded tables read as cramped next
   to every other EP Pay table). Same brand-blue header with white bold text,
   15px (--ds-font-size-md) header and body, zebra rows, brand hover, 12px/16px
   cells (~48px rows), rounded outline. The visually hidden screen-reader copy
   is unaffected. */
.dscdt { overflow: auto; border: 1px solid var(--ds-color-border); border-radius: var(--ds-radius-lg); }
.dscdt:focus-visible { outline: 2px solid var(--ds-color-border-focused); }
.dscdt--sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
table { width: 100%; border-collapse: collapse; font-size: var(--ds-font-size-md); color: var(--ds-color-text); }
caption { text-align: left; padding: 12px 16px; color: var(--ds-color-text-subtle); caption-side: top; font-size: var(--ds-font-size-sm); }
th, td { padding: 12px 16px; border-bottom: 1px solid var(--ds-color-border); text-align: left; white-space: nowrap; }
thead th {
  position: sticky; top: 0;
  background: var(--ds-color-background-brand-bold); color: var(--ds-color-text-inverse);
  font-weight: var(--ds-font-weight-bold);
  border-bottom-color: var(--ds-color-background-brand-bold);
}
tbody th { font-weight: var(--ds-font-weight-regular); }
tbody tr:nth-child(even) { background: var(--ds-color-surface-sunken); }
tbody tr:hover { background: var(--ds-color-background-brand-subtlest); }
.num { text-align: right; font-variant-numeric: tabular-nums; }
.is-missing { color: var(--ds-color-text-subtle); font-style: italic; }
tbody tr:last-child th, tbody tr:last-child td { border-bottom: 0; }

/* ---- interactive ------------------------------------------------------- */
.dscdt-x { display: flex; flex-direction: column; gap: 12px; min-width: 0; color: var(--ds-color-text); }
.dscdt-x__bar { display: flex; align-items: center; gap: 8px 16px; flex-wrap: wrap; }
.dscdt-x__search { flex: 0 1 360px; min-width: 200px; }
/* A filter, not a lookup — DsSearch's results dropdown has nothing to show. */
.dscdt-x__search :deep(.ds-search__panel) { display: none; }
.dscdt-x__count { margin: 0 0 0 auto; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); font-variant-numeric: tabular-nums; }
.dscdt-x__cols { display: flex; align-items: center; gap: 4px 12px; flex-wrap: wrap; }
.dscdt-x__cols-label { font-size: var(--ds-font-size-sm); font-weight: var(--ds-font-weight-bold); color: var(--ds-color-text-subtle); }
/* The modal body is the scroller: no overflow here, so the header row sticks
   to the modal's scrollport instead of to a box that never scrolls. */
.dscdt--interactive { overflow: visible; }
.dscdt--interactive table { border-collapse: separate; border-spacing: 0; }
.dscdt--interactive thead th { z-index: 1; padding: 0; border-bottom: 0; }
.dscdt--interactive thead th:first-child { border-top-left-radius: var(--ds-radius-lg); }
.dscdt--interactive thead th:last-child { border-top-right-radius: var(--ds-radius-lg); }
.dscdt__sort {
  display: inline-flex; align-items: center; gap: 4px; width: 100%; padding: 12px 16px;
  border: 0; background: none; font: inherit; font-weight: inherit; color: inherit; cursor: pointer; white-space: nowrap;
}
.num .dscdt__sort { justify-content: flex-end; }
/* On the blue header: a light wash on hover, a white focus ring, white icons. */
.dscdt__sort:hover { background: color-mix(in srgb, var(--ds-color-text-inverse) 14%, transparent); }
.dscdt__sort:focus-visible { outline: 2px solid var(--ds-color-text-inverse); outline-offset: -4px; }
.dscdt__sort-icon { flex: none; color: var(--ds-color-text-inverse); opacity: 0.7; }
.dscdt__sort-icon.is-active { color: var(--ds-color-text-inverse); opacity: 1; }
.dscdt__empty-row td { padding: 28px 16px; }
.dscdt__empty {
  display: flex; align-items: center; justify-content: center; gap: 8px 12px; flex-wrap: wrap;
  white-space: normal; color: var(--ds-color-text-subtle);
}
</style>
