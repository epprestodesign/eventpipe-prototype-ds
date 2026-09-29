<script setup>
// DsChartCard — the standard container for a chart: DsCard surface +
// DsChartHeader + the chart + an optional footer (source / as-of note).
//
// With `tableToggle`, the header gains an expand icon button ("View more",
// by its accessible name and tooltip) that opens a
// DsModal with the chart's data as an interactive table (search, sortable
// columns, show/hide series). The card renders its default slot twice — in
// the card with `view: 'chart'`, in the modal with `view: 'data'` — so the
// chart inside only has to bind the slot's `view`:
//   <ds-chart-card title="Revenue" table-toggle>
//     <template #default="{ view }"><ds-line-chart :view="view" … /></template>
//   </ds-chart-card>
// (The prop keeps its historical name; there is no in-card Chart/Table switch
// any more.)
import { ref, computed, watch, nextTick } from 'vue'
import DsCard from '../DsCard.vue'
import DsModal from '../DsModal.vue'
import DsChartHeader from './DsChartHeader.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /** Show the "View more" button + data-table modal. */
  tableToggle: { type: Boolean, default: false },
  /** View handed to the card body's slot. 'chart' by default; 'table' is still
   *  honoured for backward compatibility, but no UI switches to it. */
  view: { type: String, default: 'chart' },
  /** The View more modal is open. Supports v-model:data-open. */
  dataOpen: { type: Boolean, default: false },
  padding: { type: String, default: 'md' },
  headingLevel: { type: Number, default: 3 },
})
// `update:view` is kept declared so existing v-model:view bindings stay valid;
// nothing emits it now that the in-card toggle is gone.
const emit = defineEmits(['update:view', 'update:dataOpen'])

const open = ref(props.dataOpen)
watch(() => props.dataOpen, (v) => { open.value = v })

const bodyView = computed(() => (props.view === 'table' ? 'table' : 'chart'))

const moreBtn = ref(null)
const modalBody = ref(null)

function setOpen(v) {
  if (open.value === v) return
  open.value = v
  emit('update:dataOpen', v)
}

// Focus management DsModal leaves to its callers: into the dialog on open
// (the row search), back to View more on close.
watch(open, async (v, was) => {
  await nextTick()
  if (v) {
    const dialog = modalBody.value?.closest('[role="dialog"]')
    const target = dialog?.querySelector('input, button:not([aria-label="Close"]), [tabindex="0"]') || dialog?.querySelector('button')
    target?.focus()
  } else if (was) {
    const el = moreBtn.value?.$el || moreBtn.value
    el?.focus?.()
  }
}, { flush: 'post' })
</script>

<template>
  <ds-card :padding="padding" class="dscc-card">
    <ds-chart-header :title="title" :subtitle="subtitle" :level="headingLevel">
      <template v-if="$slots.actions || tableToggle" #actions>
        <slot name="actions" />
        <!-- Icon-only, borderless expand button, top right of the card (user
             requests 2026-09-29: a labelled "View more" was too heavy, then no
             border). 40×40 hit area; the tooltip and aria-label carry the words. -->
        <q-btn
          v-if="tableToggle" ref="moreBtn"
          flat icon="open_in_full" padding="0"
          class="dscc-card__more" :aria-label="`View more: ${title} data`"
          aria-haspopup="dialog" :aria-expanded="String(open)"
          @click="setOpen(true)"
        ><q-tooltip :delay="300">Expand to view the data as a table</q-tooltip></q-btn>
      </template>
    </ds-chart-header>
    <div class="dscc-card__body">
      <slot :view="bodyView" />
    </div>
    <div v-if="$slots.footer" class="dscc-card__footer"><slot name="footer" /></div>

    <ds-modal
      v-if="tableToggle" :model-value="open" size="lg" :title="title" :subtitle="subtitle"
      @update:model-value="setOpen"
    >
      <div ref="modalBody" class="dscc-card__data">
        <slot :view="'data'" />
      </div>
    </ds-modal>
  </ds-card>
</template>

<style scoped>
.dscc-card { min-width: 0; color: var(--ds-color-text); }
.dscc-card__body { margin-top: 16px; min-width: 0; }
.dscc-card__footer {
  margin-top: 12px; padding-top: 10px; border-top: 1px solid var(--ds-color-border);
  font-size: var(--ds-font-size-sm); color: var(--ds-color-text-subtle);
}
.dscc-card__more.q-btn {
  width: 40px; height: 40px; min-width: 40px; min-height: 40px;
  border: 0; border-radius: var(--ds-radius-md);
  background: transparent; color: var(--ds-color-icon-subtle);
  margin: -8px -10px 0 0; /* optically into the card's top-right corner */
}
.dscc-card__more.q-btn:hover { background: var(--ds-color-surface-sunken); color: var(--ds-color-text); }
.dscc-card__more :deep(.q-icon) { font-size: 20px; }
.dscc-card__data { min-width: 0; }
</style>
