<script setup>
// DsLineChart — change over time for one to five continuous series.
// Missing values (null) are drawn as gaps, never bridged and never dropped to
// zero. A `comparison: true` series (e.g. previous period) is drawn dashed in
// the neutral comparison colour, behind the current series.
// Props: see cartesianProps.js — the API is renderer-agnostic.
import { cartesianProps } from './cartesianProps.js'
import CartesianChart from './internal/CartesianChart.vue'

defineProps(cartesianProps)
defineEmits(['update:hiddenSeries', 'retry'])
</script>

<template>
  <cartesian-chart
    v-bind="$props" kind="line"
    @update:hidden-series="$emit('update:hiddenSeries', $event)" @retry="$emit('retry')"
  />
</template>
