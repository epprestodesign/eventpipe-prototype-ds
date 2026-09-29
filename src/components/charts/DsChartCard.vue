<script setup>
// DsChartCard — the standard container for a chart: DsCard surface +
// DsChartHeader + the chart + an optional footer (source / as-of note).
//
// With `tableToggle`, the header gains a Chart / Table switch. The card owns
// the `view` state and hands it to its default slot, so the chart inside
// switches to its data-table view:
//   <ds-chart-card title="Revenue" table-toggle>
//     <template #default="{ view }"><ds-line-chart :view="view" … /></template>
//   </ds-chart-card>
import { ref, watch } from 'vue'
import DsCard from '../DsCard.vue'
import DsChartHeader from './DsChartHeader.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /** Show the Chart / Table view switch. */
  tableToggle: { type: Boolean, default: false },
  /** 'chart' | 'table'. Supports v-model:view. */
  view: { type: String, default: 'chart' },
  padding: { type: String, default: 'md' },
  headingLevel: { type: Number, default: 3 },
})
const emit = defineEmits(['update:view'])

const current = ref(props.view)
watch(() => props.view, (v) => { current.value = v })
function setView(v) { current.value = v; emit('update:view', v) }
</script>

<template>
  <ds-card :padding="padding" class="dscc-card">
    <ds-chart-header :title="title" :subtitle="subtitle" :level="headingLevel">
      <template v-if="$slots.actions || tableToggle" #actions>
        <slot name="actions" />
        <div v-if="tableToggle" class="dscc-card__toggle" role="group" :aria-label="`${title} view`">
          <button
            type="button" class="dscc-card__tbtn" :aria-pressed="String(current === 'chart')"
            title="Chart view" @click="setView('chart')"
          ><q-icon name="bar_chart" size="18px" /><span class="dscc-card__sr">Chart view</span></button>
          <button
            type="button" class="dscc-card__tbtn" :aria-pressed="String(current === 'table')"
            title="Table view" @click="setView('table')"
          ><q-icon name="table_rows" size="18px" /><span class="dscc-card__sr">Table view</span></button>
        </div>
      </template>
    </ds-chart-header>
    <div class="dscc-card__body">
      <slot :view="current" />
    </div>
    <div v-if="$slots.footer" class="dscc-card__footer"><slot name="footer" /></div>
  </ds-card>
</template>

<style scoped>
.dscc-card { min-width: 0; color: var(--ds-color-text); }
.dscc-card__body { margin-top: 16px; min-width: 0; }
.dscc-card__footer {
  margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--ds-color-border);
  font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle);
}
.dscc-card__toggle { display: inline-flex; border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-button); overflow: hidden; }
.dscc-card__tbtn {
  display: inline-flex; align-items: center; justify-content: center; width: 40px; height: 38px;
  border: 0; background: var(--ds-color-surface); color: var(--ds-color-icon-subtle); cursor: pointer;
}
.dscc-card__tbtn + .dscc-card__tbtn { border-left: 1px solid var(--ds-color-border-bold); }
.dscc-card__tbtn[aria-pressed='true'] { background: var(--ds-color-background-brand-subtlest); color: var(--ds-color-text-brand); }
.dscc-card__tbtn:focus-visible { outline: 2px solid var(--ds-color-border-focused); outline-offset: -2px; }
.dscc-card__sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
</style>
