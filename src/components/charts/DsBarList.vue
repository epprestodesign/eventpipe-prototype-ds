<script setup>
// DsBarList — a ranked "top N" breakdown: each row a thin bar (length ∝ value,
// the largest shown value fills the track), then the label, then the value
// right-aligned, and optionally its share of the total.
//
// It is HTML, not canvas: a list (<ul>/<li>) whose text reads in order —
// label, sublabel, value, share — so it needs no hidden data table. The bars
// are decoration for sighted readers and are aria-hidden.
//
// Use it where the question is "which ones, and how much" and the labels are
// long (hotels, customers). DsBarChart horizontal is for comparing categories
// on a shared axis with gridlines; this has no axis on purpose.
//
// Missing (null) renders "—" with no bar and no track. Zero renders an empty
// track and "$0.00" — the item exists and did nothing. All row maths lives in
// barList.js (unit-tested).
import { computed } from 'vue'
import { formatValue } from './chartFormat.js'
import { barListRows } from './barList.js'
import DsChartState from './DsChartState.vue'

const props = defineProps({
  /** `{ key, label, value: number|null, sublabel?, href? }[]` — non-negative values. */
  items: { type: Array, default: () => [] },
  /** number | compact | currency | currency-compact | percent (percent expects ratios). */
  valueFormat: { type: String, default: 'number' },
  currency: { type: String, default: 'USD' },
  /** Rows shown. The rest still count toward `showShare`'s total. */
  max: { type: Number, default: 5 },
  /** Append each row's share of the total of ALL reported items. */
  showShare: { type: Boolean, default: false },
  /** desc | asc | none (keep the caller's order). Missing rows always sort last. */
  sort: { type: String, default: 'desc' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
  emptyText: { type: String, default: 'No data for this period' },
  /** Accessible name for the list. Auto-generated when omitted. */
  ariaLabel: { type: String, default: '' },
  retryable: { type: Boolean, default: true },
})
const emit = defineEmits(['retry'])

const ROW_HEIGHT = 34
const model = computed(() => barListRows(props.items, { max: props.max, sort: props.sort }))

const status = computed(() => {
  if (props.loading) return 'loading'
  if (props.error) return 'error'
  if (!props.items || !props.items.length) return 'empty'
  if (model.value.allMissing) return 'missing'
  return 'ready'
})

const fmt = (v) => formatValue(v, props.valueFormat, { currency: props.currency })
const pct = (r) => (r === null ? '—' : formatValue(r, 'percent', { decimals: 0 }))

const stateHeight = computed(() => Math.max(120, Math.min(props.max, 8) * ROW_HEIGHT))
const listLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  const n = model.value.rows.length
  const of = model.value.hidden ? ` of ${n + model.value.hidden}` : ''
  return `Top ${n}${of}, ranked by value`
})
</script>

<template>
  <div class="dsbl">
    <ds-chart-state
      v-if="status !== 'ready'" :state="status" :height="stateHeight" :retryable="retryable"
      :message="status === 'error' ? error : status === 'empty' ? emptyText : status === 'missing' ? 'No item has a reported value. This is not the same as zero.' : ''"
      @retry="emit('retry')"
    />
    <template v-else>
      <ul class="dsbl__list" :class="{ 'dsbl__list--share': showShare }" :aria-label="listLabel">
        <li v-for="r in model.rows" :key="r.key" class="dsbl__row" :class="{ 'is-missing': r.missing }">
          <span class="dsbl__track" aria-hidden="true">
            <span v-if="!r.missing" class="dsbl__bar" :style="{ width: (r.ratio * 100) + '%' }"></span>
          </span>
          <span class="dsbl__name">
            <a v-if="r.href" :href="r.href" class="dsbl__label dsbl__link">{{ r.label }}</a>
            <span v-else class="dsbl__label">{{ r.label }}</span>
            <span v-if="r.sublabel" class="dsbl__sub">{{ r.sublabel }}</span>
          </span>
          <span class="dsbl__value">{{ r.missing ? '—' : fmt(r.value) }}<span v-if="r.missing" class="dsbl__sr"> (no data)</span></span>
          <span v-if="showShare" class="dsbl__share">{{ pct(r.share) }}</span>
        </li>
      </ul>
      <p v-if="model.hasMissing" class="dsbl__note">
        <q-icon name="info_outline" size="14px" /> “—” means no value was reported — not zero.
      </p>
    </template>
  </div>
</template>

<style scoped>
.dsbl { min-width: 0; color: var(--ds-color-text); }
/* The list owns the columns and each row is a subgrid of them, so bars, labels
   and values line up across rows however wide each value is. */
.dsbl__list {
  list-style: none; margin: 0; padding: 0;
  display: grid; column-gap: 20px;
  grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.7fr) max-content;
}
.dsbl__list--share { grid-template-columns: minmax(0, 1.3fr) minmax(0, 1.7fr) max-content max-content; }
.dsbl__row {
  grid-column: 1 / -1; display: grid; grid-template-columns: subgrid; align-items: center;
  min-height: 34px; padding: 3px 0;
}
.dsbl__track {
  display: block; height: 8px; border-radius: var(--ds-radius-sm);
  background: var(--ds-color-chart-track); overflow: hidden;
}
.dsbl__row.is-missing .dsbl__track { background: transparent; }
.dsbl__bar { display: block; height: 100%; border-radius: var(--ds-radius-sm); background: var(--ds-color-chart-1); }
.dsbl__name { display: flex; flex-direction: column; min-width: 0; }
.dsbl__label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--ds-color-text-subtle); }
.dsbl__link { color: var(--ds-color-text-brand); text-decoration: none; }
.dsbl__link:hover { text-decoration: underline; }
.dsbl__link:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 2px; border-radius: var(--ds-radius-sm); }
.dsbl__sub { font-size: 0.75rem; color: var(--ds-color-text-subtle); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dsbl__value { text-align: right; font-variant-numeric: tabular-nums; font-weight: var(--ds-font-weight-bold); color: var(--ds-color-text); }
.dsbl__row.is-missing .dsbl__value { color: var(--ds-color-text-subtle); font-weight: normal; }
.dsbl__share { text-align: right; font-variant-numeric: tabular-nums; color: var(--ds-color-text-subtle); }
.dsbl__note { display: flex; align-items: center; gap: 6px; margin: 10px 0 0; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
.dsbl__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
