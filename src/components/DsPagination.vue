<script setup>
// DsPagination — the design system's pagination. The page control is exactly
// the Components › Navigation › Pagination "Rich" configuration: QPagination
// with boundary numbers (first and last page always shown), direction links,
// up to 6 page buttons, primary colour. Every paged table uses this component,
// so there is one pager in the product rather than one per screen.
//
// Optionally it also prints the "Showing 11–20 of 33 payouts" summary to the
// left of the page control (pass `total`, `pageSize` and `noun`), which is the
// table-footer layout EP Pay uses.
//
// v-model is the 1-based page. It also works uncontrolled (no v-model): it then
// keeps its own page, which suits static mocks where only the control needs to
// respond.
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: null },
  /** Number of pages. Derived from total / pageSize when omitted. */
  max: { type: Number, default: null },
  /** Page buttons shown before the control collapses to "…". */
  maxPages: { type: Number, default: 6 },
  /** Total result count — enables the "Showing x–y of z" summary. */
  total: { type: Number, default: null },
  pageSize: { type: Number, default: 10 },
  /** What is being counted, plural — e.g. "payouts". */
  noun: { type: String, default: '' },
  /** Singular form for a total of exactly 1. Defaults to `noun` minus a trailing "s". */
  nounOne: { type: String, default: '' },
  /** Hide the page control when there is only one page (the summary stays). */
  hideSinglePage: { type: Boolean, default: true },
})
const emit = defineEmits(['update:modelValue'])

const own = ref(1)
const page = computed({
  get: () => props.modelValue ?? own.value,
  set: (v) => { own.value = v; emit('update:modelValue', v) },
})

const pages = computed(() => {
  if (props.max != null) return Math.max(1, props.max)
  if (props.total != null) return Math.max(1, Math.ceil(props.total / Math.max(1, props.pageSize)))
  return 1
})
// Keep the page in range when the result set shrinks (e.g. after filtering).
watch(pages, (n) => { if (page.value > n) page.value = n })

const summary = computed(() => {
  if (props.total == null) return ''
  const word = props.total === 1 ? (props.nounOne || props.noun.replace(/s$/, '')) : props.noun
  const noun = word ? ` ${word}` : ''
  if (props.total === 0) return `Showing 0${noun}`
  const start = (page.value - 1) * props.pageSize + 1
  const end = Math.min(page.value * props.pageSize, props.total)
  return `Showing ${start}–${end} of ${props.total.toLocaleString('en-US')}${noun}`
})
const showControl = computed(() => !(props.hideSinglePage && pages.value <= 1))
</script>

<template>
  <nav class="dspg" :class="{ 'dspg--split': summary }" aria-label="Pagination">
    <span v-if="summary" class="dspg__summary" aria-live="polite">{{ summary }}</span>
    <q-pagination
      v-if="showControl"
      v-model="page"
      :max="pages"
      :max-pages="maxPages"
      boundary-numbers
      direction-links
      color="primary"
    />
  </nav>
</template>

<style scoped>
.dspg { display: flex; align-items: center; justify-content: flex-end; gap: 16px; flex-wrap: wrap; }
.dspg--split { justify-content: space-between; }
.dspg__summary { font-size: 0.8125rem; color: var(--ds-color-text-subtle); }
</style>
