<script setup>
// DsChartLegend — the HTML legend every chart uses. Swatches paint straight
// from the chart colour tokens (var(--ds-color-chart-*)), so the legend follows
// the theme without resolving anything. Text wears text tokens, never the
// series colour — the swatch carries identity.
//
// Interactive legends are real toggle buttons (aria-pressed), so hiding a
// series is keyboard- and screen-reader-operable.
import { slotVar } from './chartTheme.js'

defineProps({
  /** `{ key, label, color: 'chart-1'…'chart-5'|'comparison', dashed?, value?, detail? }[]` */
  items: { type: Array, default: () => [] },
  /** Keys currently hidden. */
  hidden: { type: Array, default: () => [] },
  /** Toggle series on click. Static legends render as a plain list. */
  interactive: { type: Boolean, default: true },
  /** row (wrapping, above/below a plot) | column (beside a donut). */
  layout: { type: String, default: 'row' },
})
const emit = defineEmits(['toggle'])
</script>

<template>
  <ul class="dscl" :class="`dscl--${layout}`" aria-label="Legend">
    <li v-for="it in items" :key="it.key" class="dscl__li">
      <component
        :is="interactive ? 'button' : 'span'"
        :type="interactive ? 'button' : undefined"
        class="dscl__item"
        :class="{ 'is-off': hidden.includes(it.key), 'is-btn': interactive }"
        :aria-pressed="interactive ? String(!hidden.includes(it.key)) : undefined"
        :title="interactive ? (hidden.includes(it.key) ? 'Show ' : 'Hide ') + it.label : undefined"
        @click="interactive && emit('toggle', it.key)"
      >
        <span
          class="dscl__swatch" :class="{ 'dscl__swatch--dashed': it.dashed }"
          :style="{ '--sw': slotVar(it.color) }" aria-hidden="true"
        ></span>
        <span class="dscl__label">{{ it.label }}</span>
        <span v-if="it.value !== undefined" class="dscl__value">{{ it.value }}</span>
        <span v-if="it.detail" class="dscl__detail">{{ it.detail }}</span>
      </component>
    </li>
  </ul>
</template>

<style scoped>
.dscl { list-style: none; margin: 0 -6px; padding: 0; display: flex; gap: 4px 4px; flex-wrap: wrap; }
.dscl--column { flex-direction: column; gap: 2px; }
.dscl__li { flex: none; max-width: 100%; }
.dscl--column .dscl__li { min-width: 0; }
.dscl__item {
  display: inline-flex; align-items: center; gap: 8px; min-height: 28px; max-width: 100%;
  padding: 2px 6px; border: 0; background: none; border-radius: var(--ds-radius-sm);
  font: inherit; font-size: var(--ds-font-size-sm); color: var(--ds-color-text); text-align: left;
}
.dscl--column .dscl__item { width: 100%; }
.dscl__item.is-btn { cursor: pointer; }
.dscl__item.is-btn:hover { background: var(--ds-color-background-neutral); }
.dscl__item.is-btn:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: 1px; }
.dscl__item.is-off .dscl__label { color: var(--ds-color-text-subtle); text-decoration: line-through; }
.dscl__item.is-off .dscl__swatch { background: transparent; box-shadow: inset 0 0 0 2px var(--sw); }
.dscl__swatch { flex: none; width: 12px; height: 12px; border-radius: var(--ds-radius-sm); background: var(--sw); }
.dscl__swatch--dashed { height: 0; border-radius: 0; background: none; border-top: 2px dashed var(--sw); }
.dscl__item.is-off .dscl__swatch--dashed { box-shadow: none; opacity: 0.5; }
.dscl__label { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.dscl--column .dscl__label { flex: 1; }
.dscl__value { font-weight: var(--ds-font-weight-bold); font-variant-numeric: tabular-nums; }
.dscl__detail { color: var(--ds-color-text-subtle); font-variant-numeric: tabular-nums; min-width: 3.5em; text-align: right; }
</style>
