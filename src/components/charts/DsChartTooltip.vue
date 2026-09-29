<script setup>
// DsChartTooltip — the hover/focus tooltip for every chart.
//
// It is HTML, not canvas, so it wears the DS tokens and follows the theme of
// the chart it belongs to (it renders inside the chart root, so a local
// .ds-theme-dark scope reaches it too). It is `position: fixed` against the
// viewport, which is why a card's `overflow: hidden` cannot clip it, and it
// flips/clamps itself to stay on screen.
//
// `inline` renders it in normal flow — used by the Shared Elements story.
import { ref, watch, nextTick } from 'vue'
import { slotVar } from './chartTheme.js'

const props = defineProps({
  visible: { type: Boolean, default: true },
  /** Heading, e.g. the long-form date. */
  title: { type: String, default: '' },
  /** `{ key, label, color, value, missing?, dashed?, detail? }[]` */
  rows: { type: Array, default: () => [] },
  /** Anchor point in viewport coordinates. */
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  inline: { type: Boolean, default: false },
})

const el = ref(null)
const pos = ref({ left: 0, top: 0 })
const GAP = 14

async function place() {
  if (props.inline || !props.visible) return
  await nextTick()
  const box = el.value?.getBoundingClientRect()
  if (!box) return
  const vw = window.innerWidth
  const vh = window.innerHeight
  let left = props.x + GAP
  if (left + box.width > vw - 8) left = props.x - GAP - box.width // flip to the left
  left = Math.max(8, Math.min(left, vw - box.width - 8))
  let top = props.y - box.height / 2
  top = Math.max(8, Math.min(top, vh - box.height - 8))
  pos.value = { left, top }
}
watch(() => [props.x, props.y, props.visible, props.rows, props.title], place, { deep: true, immediate: true })
</script>

<template>
  <div
    v-show="visible" ref="el" class="dsct" :class="{ 'dsct--inline': inline }"
    :style="inline ? null : { left: pos.left + 'px', top: pos.top + 'px' }"
    role="status" aria-live="polite"
  >
    <div v-if="title" class="dsct__title">{{ title }}</div>
    <div v-for="r in rows" :key="r.key" class="dsct__row">
      <span class="dsct__sw" :class="{ 'dsct__sw--dashed': r.dashed }" :style="{ '--sw': slotVar(r.color) }" aria-hidden="true"></span>
      <span class="dsct__label">{{ r.label }}</span>
      <span class="dsct__value" :class="{ 'is-missing': r.missing }">{{ r.missing ? 'No data' : r.value }}</span>
      <span v-if="r.detail && !r.missing" class="dsct__detail">{{ r.detail }}</span>
    </div>
  </div>
</template>

<style scoped>
.dsct {
  position: fixed; z-index: 9000; pointer-events: none;
  min-width: 160px; max-width: 300px; padding: 10px 12px;
  background: var(--ds-color-surface-overlay); color: var(--ds-color-text);
  border: 1px solid var(--ds-color-border-container); border-radius: var(--ds-radius-md);
  box-shadow: var(--ds-shadow-2);
  font-size: var(--ds-font-size-sm); line-height: 1.35;
}
.dsct--inline { position: static; display: inline-block; }
.dsct__title { font-weight: var(--ds-font-weight-bold); margin-bottom: 6px; }
.dsct__row { display: flex; align-items: center; gap: 8px; padding: 2px 0; }
.dsct__sw { flex: none; width: 10px; height: 10px; border-radius: var(--ds-radius-sm); background: var(--sw); }
.dsct__sw--dashed { height: 0; border-radius: 0; background: none; border-top: 2px dashed var(--sw); }
.dsct__label { flex: 1; min-width: 0; color: var(--ds-color-text-subtle); overflow-wrap: anywhere; }
.dsct__value { font-weight: var(--ds-font-weight-bold); font-variant-numeric: tabular-nums; white-space: nowrap; }
.dsct__value.is-missing { font-weight: var(--ds-font-weight-regular); font-style: italic; color: var(--ds-color-text-subtle); }
.dsct__detail { color: var(--ds-color-text-subtle); font-variant-numeric: tabular-nums; white-space: nowrap; }
</style>
