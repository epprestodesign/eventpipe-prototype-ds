<script setup>
// DsStackedBarChart — composition: how parts make up each category's total.
// `percent` normalises every bar to 100% (the tooltip still shows the raw
// value beside the share). A category whose parts total zero, or are all
// missing, has no composition and draws no bar — it is not shown as 0%.
import { cartesianProps } from './cartesianProps.js'
import CartesianChart from './internal/CartesianChart.vue'

defineProps({
  ...cartesianProps,
  horizontal: { type: Boolean, default: false },
  /** Normalise each bar to 100%. */
  percent: { type: Boolean, default: false },
  /** Compact share bar: no axes or grid, the bar fills the height. */
  bare: { type: Boolean, default: false },
})
defineEmits(['update:hiddenSeries', 'retry'])
</script>

<template>
  <cartesian-chart
    v-bind="$props" kind="bar" stacked
    @update:hidden-series="$emit('update:hiddenSeries', $event)" @retry="$emit('retry')"
  />
</template>
