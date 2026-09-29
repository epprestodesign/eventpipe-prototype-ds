<script setup>
// DsBarChart — compare magnitudes across categories. Two or more series are
// grouped side by side (e.g. current vs previous period). `horizontal` is the
// right choice for long category names or many categories: the labels get the
// full width instead of being truncated under each bar.
import { cartesianProps } from './cartesianProps.js'
import CartesianChart from './internal/CartesianChart.vue'

defineProps({
  ...cartesianProps,
  /** Bars run left-to-right with categories on the vertical axis. */
  horizontal: { type: Boolean, default: false },
})
defineEmits(['update:hiddenSeries', 'retry'])
</script>

<template>
  <cartesian-chart
    v-bind="$props" kind="bar"
    @update:hidden-series="$emit('update:hiddenSeries', $event)" @retry="$emit('retry')"
  />
</template>
