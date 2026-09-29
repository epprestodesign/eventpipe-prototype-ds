<script setup>
// DsMetricCard — a headline metric with its period comparison and trend.
//
// Composition, not a new primitive: DsCard (surface) + DsStat (the DS metric:
// value over label) + a delta badge + DsSparkline. It formats through the same
// chart formatters as every chart, so "$48.2K" means the same thing in a card
// and on an axis.
//
// The delta badge states direction with an icon AND text, never colour alone.
// Whether "up" is good depends on the metric (revenue vs. disputes), so the
// colour comes from `polarity`, not from the direction.
//
// Note: EP Pay's EpPayStatCard (uncommitted, src/stories/eppay/components) is
// a hand-rolled precursor of this card and should migrate onto it.
import { computed } from 'vue'
import DsCard from '../DsCard.vue'
import DsStat from '../DsStat.vue'
import DsSparkline from './DsSparkline.vue'
import { formatValue, formatDelta, isMissing } from './chartFormat.js'

const props = defineProps({
  label: { type: String, required: true },
  /** Current value (number, or null when not reported). */
  value: { type: Number, default: null },
  /** Previous-period value for the comparison. null → "No comparison". */
  previousValue: { type: Number, default: null },
  valueFormat: { type: String, default: 'number' },
  currency: { type: String, default: 'USD' },
  /** e.g. "vs. previous 30 days". */
  comparisonLabel: { type: String, default: 'vs. previous period' },
  /** up-is-good | down-is-good | neutral — which direction reads as positive. */
  polarity: { type: String, default: 'up-is-good' },
  /** Current-period trend. */
  spark: { type: Array, default: () => [] },
  /** Previous-period trend, drawn neutral behind. */
  sparkPrevious: { type: Array, default: () => [] },
  /** Start / end captions under the sparkline. */
  rangeStart: { type: String, default: '' },
  rangeEnd: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const valueText = computed(() => formatValue(props.value, props.valueFormat, { currency: props.currency }))
const prevText = computed(() => formatValue(props.previousValue, props.valueFormat, { currency: props.currency }))
const delta = computed(() => formatDelta(props.value, props.previousValue))
const ICON = { up: 'trending_up', down: 'trending_down', flat: 'trending_flat' }
const tone = computed(() => {
  const d = delta.value.direction
  if (d === 'none' || d === 'flat' || props.polarity === 'neutral') return 'neutral'
  const good = props.polarity === 'down-is-good' ? d === 'down' : d === 'up'
  return good ? 'positive' : 'negative'
})
const deltaSr = computed(() => {
  const d = delta.value
  if (d.direction === 'none') return 'No comparison data'
  const word = { up: 'Up', down: 'Down', flat: 'Unchanged' }[d.direction]
  return `${word} ${d.text === 'New' ? 'from zero' : d.text.replace(/^[+−]/, '')} ${props.comparisonLabel}, from ${prevText.value}`
})
const sparkTone = computed(() => (tone.value === 'negative' ? 'negative' : 'brand'))
</script>

<template>
  <ds-card padding="md" class="dsmc">
    <template v-if="loading">
      <div class="dsmc__sr" role="status">Loading {{ label }}…</div>
      <q-skeleton type="text" width="40%" height="34px" />
      <q-skeleton type="text" width="60%" />
      <q-skeleton type="rect" height="40px" class="q-mt-md" />
    </template>

    <template v-else-if="error">
      <div class="dsmc__label">{{ label }}</div>
      <div class="dsmc__error" role="status"><q-icon name="error_outline" size="18px" /> {{ error }}</div>
    </template>

    <template v-else>
      <div class="dsmc__top">
        <ds-stat :value="valueText" :label="label" class="dsmc__stat" />
        <span
          class="dsmc__delta" :class="`dsmc__delta--${tone}`"
          :aria-label="deltaSr" role="img"
        >
          <q-icon v-if="ICON[delta.direction]" :name="ICON[delta.direction]" size="16px" />
          <span>{{ delta.text }}</span>
        </span>
      </div>
      <div class="dsmc__compare">
        <template v-if="!isMissing(previousValue)">{{ prevText }} {{ comparisonLabel }}</template>
        <template v-else>No data for the comparison period</template>
      </div>
      <div v-if="spark.length" class="dsmc__spark">
        <ds-sparkline :data="spark" :comparison="sparkPrevious" :tone="sparkTone" :height="44" :value-format="valueFormat" :currency="currency" />
        <div v-if="rangeStart || rangeEnd" class="dsmc__range"><span>{{ rangeStart }}</span><span>{{ rangeEnd }}</span></div>
      </div>
    </template>
  </ds-card>
</template>

<style scoped>
.dsmc { min-width: 0; display: flex; flex-direction: column; color: var(--ds-color-text); }
.dsmc__top { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: 8px 12px; }
.dsmc__stat { min-width: 0; }
.dsmc__stat :deep(.dsstat__value) { font-size: 1.75rem; font-variant-numeric: tabular-nums; }
.dsmc__delta {
  flex: none; display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px;
  border-radius: var(--ds-radius-sm); font-size: 0.8125rem; font-weight: var(--ds-font-weight-bold);
}
.dsmc__delta--positive { background: var(--ds-color-background-success); color: var(--ds-color-text-success); }
.dsmc__delta--negative { background: var(--ds-color-background-danger); color: var(--ds-color-chart-badge-negative); }
.dsmc__delta--neutral { background: var(--ds-color-background-neutral); color: var(--ds-color-text); }
.dsmc__compare { margin-top: 6px; font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
.dsmc__spark { margin-top: 14px; }
.dsmc__range {
  display: flex; justify-content: space-between; margin-top: 6px; padding-top: 6px;
  border-top: 1px solid var(--ds-color-border); font-size: 0.75rem; color: var(--ds-color-text-subtle);
}
.dsmc__label { font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle); }
.dsmc__error { display: flex; align-items: center; gap: 6px; margin-top: 8px; color: var(--ds-color-text-danger); }
.dsmc__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
