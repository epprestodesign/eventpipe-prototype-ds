<script setup>
/* EpPayStatCard — a dashboard metric with a sparkline.
 *
 * The reference draws two lines per card: this period in teal, last year in
 * grey behind it. The comparison is the point of the card — a number with a
 * percentage badge and no baseline tells you a direction but not a magnitude —
 * so the grey line is not decoration and is drawn even when flat.
 *
 * The sparkline is inline SVG rather than a chart library: it has no axes, no
 * tooltips and no interaction, and pulling in a charting dependency for a
 * polyline would cost more than it returns.
 */
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  unit: { type: String, default: '' },
  /** Comparison line, e.g. "$1,829.25 previous year". */
  prev: { type: String, default: '' },
  /** Percentage change badge, e.g. "14.2%". */
  delta: { type: String, default: '' },
  /** This period's series. */
  spark: { type: Array, default: () => [] },
  /** Last year's series, drawn grey behind. Flat when omitted. */
  sparkPrev: { type: Array, default: () => [] },
  rangeStart: { type: String, default: '12 AM, Aug 20, 2026' },
  rangeEnd: { type: String, default: '11:59 PM' },
})

const W = 560
const H = 64

/** Map a series to an SVG polyline across a fixed box. A flat or empty series
 *  still returns a straight line along the baseline, which is the honest
 *  rendering of "nothing happened" — an empty chart area reads as broken. */
function points(series) {
  if (!series.length) return `0,${H} ${W},${H}`
  const max = Math.max(...series, 1)
  const step = W / (series.length - 1 || 1)
  return series.map((v, i) => `${(i * step).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`).join(' ')
}

const line = computed(() => points(props.spark))
const linePrev = computed(() => points(props.sparkPrev.length ? props.sparkPrev : props.spark.map(() => 0.12)))
</script>

<template>
  <q-card flat bordered class="epsc">
    <div class="epsc__head">
      <span class="epsc__label">{{ label }}</span>
      <span v-if="delta" class="epsc__delta">
        <q-icon name="trending_up" size="14px" /> {{ delta }}
      </span>
    </div>

    <div class="epsc__value">
      {{ value }}<span v-if="unit" class="epsc__unit">{{ unit }}</span>
      <span v-if="prev" class="epsc__prev">{{ prev }}</span>
    </div>

    <svg class="epsc__spark" :viewBox="`0 0 ${W} ${H}`" preserveAspectRatio="none" aria-hidden="true">
      <polyline :points="linePrev" fill="none" stroke="var(--ds-color-border-bold)" stroke-width="2" vector-effect="non-scaling-stroke" />
      <polyline :points="line" fill="none" stroke="var(--ds-color-background-brand-bold)" stroke-width="2" vector-effect="non-scaling-stroke" />
    </svg>

    <div class="epsc__range">
      <span>{{ rangeStart }}</span>
      <span>{{ rangeEnd }}</span>
    </div>
  </q-card>
</template>

<style scoped>
.epsc { padding: 18px 20px 12px; height: 100%; display: flex; flex-direction: column; }
.epsc__head { display: flex; align-items: center; gap: 10px; }
.epsc__label { font-size: 1rem; font-weight: 700; color: var(--ds-color-text); }
.epsc__delta {
  display: inline-flex; align-items: center; gap: 3px;
  background: var(--ds-color-background-success); color: var(--ds-color-text-success);
  border-radius: var(--ds-radius-sm);
  padding: 2px 7px; font-size: 0.75rem; font-weight: 700;
}
.epsc__value { margin-top: 10px; font-size: 1.75rem; font-weight: 700; color: var(--ds-color-text); }
.epsc__unit { font-size: 0.9375rem; font-weight: 400; color: var(--ds-color-text-subtle); margin-left: 6px; }
.epsc__prev { font-size: 0.8125rem; font-weight: 400; color: var(--ds-color-text-subtle); margin-left: 10px; }
.epsc__spark { width: 100%; height: 64px; margin: 14px 0 6px; flex: 1; }
.epsc__range {
  display: flex; justify-content: space-between;
  border-top: 1px solid var(--ds-color-border);
  padding-top: 8px; font-size: 0.75rem; color: var(--ds-color-text-subtle);
}
</style>
