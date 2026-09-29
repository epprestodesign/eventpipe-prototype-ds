<script setup>
// DsAreaChart — a line chart whose filled area carries volume: growth over
// time, or (with `stacked`) how parts build a total over time. Fills are the
// series colour at low opacity so gridlines stay legible. Missing values are
// gaps. Stacked areas need complete data to be honest — a gap in a lower
// layer shifts every layer above it — so prefer a table or unstacked view
// when data is sparse.
import { cartesianProps } from './cartesianProps.js'
import CartesianChart from './internal/CartesianChart.vue'

defineProps({
  ...cartesianProps,
  /** Stack series so the top edge is the total. */
  stacked: { type: Boolean, default: false },
})
defineEmits(['update:hiddenSeries', 'retry'])
</script>

<template>
  <cartesian-chart
    v-bind="$props" kind="area"
    @update:hidden-series="$emit('update:hiddenSeries', $event)" @retry="$emit('retry')"
  />
</template>
