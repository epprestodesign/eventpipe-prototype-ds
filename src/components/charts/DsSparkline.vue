<script setup>
// DsSparkline — a word-sized trend: no axes, no gridlines, no tooltip.
//
// Deliberately inline SVG rather than the chart renderer. A sparkline has no
// interaction to power, a dashboard may show a dozen of them, and SVG strokes
// can read `var(--ds-color-*)` directly, so theme switching needs no JS.
// (Same reasoning the existing EP Pay stat-card sparkline documented.)
//
// Missing points break the line (a gap), exactly like the full line chart.
// A flat or all-zero series draws a flat line on the baseline — the honest
// picture of "nothing changed", not an empty box.
import { computed } from 'vue'
import { isMissing, formatValue } from './chartFormat.js'
import { extent } from './chartData.js'

const props = defineProps({
  /** `(number|null)[]` */
  data: { type: Array, default: () => [] },
  /** Optional comparison series (e.g. previous period), drawn neutral behind. */
  comparison: { type: Array, default: () => [] },
  height: { type: Number, default: 40 },
  /** brand | positive | negative | neutral — the colour of the main line. */
  tone: { type: String, default: 'brand' },
  /** Fill the area under the main line. */
  area: { type: Boolean, default: false },
  /** Mark the last point with a dot. */
  showEndPoint: { type: Boolean, default: true },
  valueFormat: { type: String, default: 'number' },
  currency: { type: String, default: 'USD' },
  /** Accessible description. Auto-generated when omitted. Pass '' via decorative to hide. */
  ariaLabel: { type: String, default: '' },
  /** Hide from assistive tech when the surrounding text already states the trend. */
  decorative: { type: Boolean, default: false },
})

const W = 100 // viewBox width; stretched to the container with non-scaling strokes
const PAD = 3

const TONE = {
  brand: 'var(--ds-color-chart-1)',
  positive: 'var(--ds-color-chart-positive)',
  negative: 'var(--ds-color-chart-negative)',
  neutral: 'var(--ds-color-chart-comparison)',
}
const stroke = computed(() => TONE[props.tone] || TONE.brand)

const scale = computed(() => {
  const all = [...props.data, ...props.comparison]
  const e = extent(all)
  if (!e) return null
  // Sparklines scale to their own extent (shape, not magnitude) — the value
  // beside the sparkline carries the magnitude.
  return { min: e.min, span: e.max - e.min }
})

function y(v) {
  const s = scale.value
  const H = props.height
  if (!s || s.span === 0) return H - PAD // flat → baseline
  return PAD + (1 - (v - s.min) / s.span) * (H - PAD * 2)
}
function x(i, n) { return n <= 1 ? W / 2 : (i / (n - 1)) * W }

/** Build path segments, breaking at missing values. */
function segments(series) {
  const n = series.length
  const segs = []
  let cur = []
  series.forEach((v, i) => {
    if (isMissing(v)) { if (cur.length) segs.push(cur); cur = []; return }
    cur.push([x(i, n), y(v)])
  })
  if (cur.length) segs.push(cur)
  return segs
}
const toD = (seg) => seg.map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(2)},${py.toFixed(2)}`).join(' ')

const mainSegs = computed(() => segments(props.data))
const compSegs = computed(() => segments(props.comparison))
const areaPaths = computed(() => mainSegs.value.filter((s) => s.length > 1).map((s) => `${toD(s)} L${s[s.length - 1][0].toFixed(2)},${props.height} L${s[0][0].toFixed(2)},${props.height} Z`))
const singles = computed(() => mainSegs.value.filter((s) => s.length === 1).map((s) => s[0]))
const endPoint = computed(() => {
  const d = props.data
  const last = d.length - 1
  if (last < 0 || isMissing(d[last])) return null
  return [x(last, d.length), y(d[last])]
})

const label = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  const present = props.data.filter((v) => !isMissing(v))
  if (!present.length) return 'Trend: no data'
  const first = present[0]
  const last = present[present.length - 1]
  const dir = last > first ? 'up' : last < first ? 'down' : 'flat'
  const f = (v) => formatValue(v, props.valueFormat, { currency: props.currency })
  return `Trend ${dir}, from ${f(first)} to ${f(last)}${present.length < props.data.length ? ', with gaps in the data' : ''}`
})
</script>

<template>
  <svg
    class="dssp" :viewBox="`0 0 ${W} ${height}`" preserveAspectRatio="none" :style="{ height: height + 'px', '--stroke': stroke }"
    :role="decorative ? undefined : 'img'" :aria-label="decorative ? undefined : label" :aria-hidden="decorative ? 'true' : undefined"
  >
    <line v-if="!data.length" class="dssp__track" x1="0" :y1="height - PAD" :x2="W" :y2="height - PAD" />
    <path v-for="(d, i) in areaPaths" v-show="area" :key="'a' + i" class="dssp__area" :d="d" />
    <path v-for="(s, i) in compSegs" :key="'c' + i" class="dssp__comp" :d="toD(s)" />
    <path v-for="(s, i) in mainSegs" :key="'m' + i" class="dssp__line" :d="toD(s)" />
    <!-- Dots are drawn as zero-length round-capped lines so they stay circular
         under preserveAspectRatio="none". -->
    <path v-for="(p, i) in singles" :key="'s' + i" class="dssp__dot" :d="`M${p[0]},${p[1]} l0,0`" />
    <path v-if="showEndPoint && endPoint" class="dssp__dot dssp__dot--end" :d="`M${endPoint[0]},${endPoint[1]} l0,0`" />
  </svg>
</template>

<style scoped>
.dssp { display: block; width: 100%; overflow: visible; }
.dssp__line { fill: none; stroke: var(--stroke); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; vector-effect: non-scaling-stroke; }
.dssp__comp { fill: none; stroke: var(--ds-color-chart-comparison); stroke-width: 1.5; stroke-dasharray: 4 3; vector-effect: non-scaling-stroke; }
.dssp__area { fill: var(--stroke); opacity: 0.12; stroke: none; }
.dssp__track { stroke: var(--ds-color-chart-track); stroke-width: 2; vector-effect: non-scaling-stroke; }
.dssp__dot { stroke: var(--stroke); stroke-width: 6; stroke-linecap: round; vector-effect: non-scaling-stroke; }
</style>
