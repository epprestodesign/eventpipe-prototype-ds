<script setup>
// The Compliance page, rebuilt from the TTS production captures
// (references/110626): Filter + "Filtered By:" chips, the inline filter panel,
// and the Reconciliation | Compliance tabs.
//
// STA-1: "Add/Update Teams" ▾ replaces the Registration Data Uploader button —
//        same blue spot, beside the grey Export ▾.
// STA-2: Event Name is a type-ahead that picks one event; Add single team
//        preselects that event.
// STD-1: rows open Team Edit; no delete on rows.
// STD-3: after a delete the user lands here with a success message linking
//        to Reconciliation (11/09 review: no activity-log link).
import { computed, reactive, ref, watch } from 'vue'
import DsSelect from '../../../../components/DsSelect.vue'
import DsInput from '../../../../components/DsInput.vue'
import DsField from '../../../../components/DsField.vue'
import DsAlert from '../../../../components/DsAlert.vue'
import DsLink from '../../../../components/DsLink.vue'
import StdAddUpdateTeamsButton from './StdAddUpdateTeamsButton.vue'
import StdEventField from './StdEventField.vue'
import { STATUS_OPTIONS, complianceNeed, displayName, eventMatches, filterChips, filterTeams } from '../_std'

const props = defineProps({
  teams: { type: Array, required: true },
  events: { type: Array, required: true },
  /** Applied filters (v-model:filters). */
  filters: { type: Object, required: true },
  /** reconciliation | compliance (v-model:tab). */
  tab: { type: String, default: 'compliance' },
  /** STD-3 success message: { text, eventId } */
  flash: { type: Object, default: null },
})
const emit = defineEmits(['update:filters', 'update:tab', 'open-team', 'add-single', 'upload', 'dismiss-flash', 'open-reconciliation'])

/* Filter panel: edits a draft; Apply Filters commits it, as production does. */
const panelOpen = ref(false)
const draft = reactive({ ...props.filters })
watch(() => props.filters, (f) => Object.assign(draft, f), { deep: true })
const apply = () => { emit('update:filters', { ...draft }); panelOpen.value = false }
const clearAll = () => { Object.assign(draft, { entityName: '', eventId: '', date: '', producer: '', manager: '', type: '', status: '', favorites: false }); apply() }
const removeChip = (key) => emit('update:filters', { ...props.filters, [key]: key === 'favorites' ? false : '' })

const chips = computed(() => filterChips(props.filters))
const uniq = (k) => [...new Set(props.events.map((e) => e[k]))]
const startOf = (id) => props.events.find((e) => e.id === id)

const rows = computed(() => filterTeams(props.teams, props.events, props.filters)
  .map((t) => ({ ...t, event: startOf(t.eventId) }))
  .sort((a, b) => a.event.isoStart.localeCompare(b.event.isoStart) || displayName(a).localeCompare(displayName(b))))
const recRows = computed(() => props.events.filter((e) => eventMatches(e, props.filters))
  .sort((a, b) => a.isoStart.localeCompare(b.isoStart)))

const COLUMNS = [
  { name: 'event', label: 'Event Name', field: (t) => t.event.name, align: 'left', style: 'min-width:220px' },
  { name: 'start', label: 'Event Start Date', field: (t) => t.event.start, align: 'left', sortable: true, sort: (a, b, ra, rb) => ra.event.isoStart.localeCompare(rb.event.isoStart) },
  { name: 'team', label: 'Team/Org', field: (t) => displayName(t), align: 'left', style: 'min-width:240px' },
  { name: 'need', label: 'Compliance Need', field: (t) => complianceNeed(t), align: 'left', style: 'min-width:150px' },
  { name: 'goal', label: 'Goal', field: 'goal', align: 'left' },
  { name: 'res', label: 'Reservations', field: 'reservations', align: 'left' },
  { name: 'nights', label: 'Nights Booked', field: 'nights', align: 'left' },
  { name: 'blocks', label: 'Open Group Blocks', field: 'openBlocks', align: 'left' },
  { name: 'peak', label: 'Peak Nights Avail. in Blocks', field: 'peakAvail', align: 'left' },
  { name: 'notes', label: 'Notes', field: (t) => t.notes || '-', align: 'left' },
]
const REC_COLUMNS = [
  { name: 'name', label: 'Event Name', field: 'name', align: 'left' },
  { name: 'start', label: 'Event Start Date', field: 'start', align: 'left' },
  { name: 'blocks', label: 'Unlinked Group Blocks', field: 'unlinkedBlocks', align: 'left' },
  { name: 'res', label: 'Unlinked Reservations', field: 'unlinkedRes', align: 'left' },
]
const NEED_TONE = { Compliant: 'ok', Exempt: 'exempt', 'Not Coming': 'away', Local: 'exempt', Need: 'need' }
</script>

<template>
  <div class="stdc">
    <div class="row items-center q-mb-md">
      <h1 class="stdc__title">Compliance</h1>
      <q-space />
      <div class="row q-gutter-sm no-wrap">
        <std-add-update-teams-button @upload="emit('upload')" @add-single="emit('add-single')" />
        <q-btn-dropdown flat no-caps label="Export" dropdown-icon="arrow_drop_down" class="stdc__export" content-class="stdc__menu">
          <q-list style="min-width:200px;">
            <q-item v-close-popup clickable><q-item-section>Compliance Report</q-item-section></q-item>
            <q-item v-close-popup clickable><q-item-section>Compliance Credits</q-item-section></q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>

    <!-- Filter bar + inline panel -->
    <q-card flat bordered class="stdc__filters">
      <div class="row items-center no-wrap q-gutter-md">
        <q-btn no-caps color="white" text-color="primary" icon="filter_alt" label="Filter" class="stdc__filterbtn"
          :aria-expanded="String(panelOpen)" @click="panelOpen = !panelOpen" />
        <q-separator vertical />
        <span class="stdc__by">Filtered By:</span>
        <div class="row q-gutter-sm">
          <span v-for="c in chips" :key="c.key" class="stdc__chip">
            {{ c.label }}
            <button type="button" class="stdc__chip-x" :aria-label="`Remove ${c.label} filter`" @click="removeChip(c.key)"><q-icon name="close" size="14px" /></button>
          </span>
          <span v-if="!chips.length" class="stdc__none">Nothing — showing every event</span>
        </div>
      </div>
      <div v-show="panelOpen" class="stdc__panel">
        <ds-input v-model="draft.entityName" label="Entity Name" hint="Must type 4 characters to search" />
        <!-- Production shows this date as yyyy-mm-dd, so it uses its own mask
             rather than DsInput's MM/DD/YYYY date type. -->
        <ds-field label="Event Start Date">
          <q-input v-model="draft.date" outlined dense hide-bottom-space clearable placeholder="yyyy-mm-dd" mask="####-##-##">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="draft.date" mask="YYYY-MM-DD" color="primary"><div class="row justify-end"><q-btn v-close-popup flat no-caps color="primary" label="Done" /></div></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </ds-field>
        <ds-select v-model="draft.producer" label="Event Producer Company" :options="['', ...uniq('producer')].map((v) => ({ label: v || 'Any', value: v }))" />
        <ds-select v-model="draft.manager" label="Event Manager" :options="['', ...uniq('manager')].map((v) => ({ label: v || 'Any', value: v }))" />
        <std-event-field v-model="draft.eventId" :events="events" />
        <ds-select v-model="draft.type" label="Event Type" :options="['', ...uniq('type')].map((v) => ({ label: v || 'Any', value: v }))" />
        <ds-select v-model="draft.status" label="Compliance Status" placeholder="Select Compliance Status" :options="['', ...STATUS_OPTIONS].map((v) => ({ label: v || 'Any', value: v }))" />
        <div class="stdc__panel-end">
          <q-checkbox v-model="draft.favorites" dense label="Show Favorites" />
          <div class="row q-gutter-sm">
            <q-btn outline no-caps color="grey-8" label="Clear All" @click="clearAll" />
            <q-btn unelevated no-caps color="primary" label="Apply Filters" @click="apply" />
          </div>
        </div>
      </div>
    </q-card>

    <ds-alert v-if="flash" severity="success" :title="flash.text" class="q-mt-md">
      Its linked group blocks and reservations were moved to Reconciliation.
      <ds-link href="#reconciliation" @click.prevent="emit('open-reconciliation', flash.eventId)">View in Reconciliation</ds-link>
      <template #action><q-btn flat round dense icon="close" aria-label="Dismiss" @click="emit('dismiss-flash')" /></template>
    </ds-alert>

    <q-tabs :model-value="tab" no-caps active-color="primary" indicator-color="primary" align="left"
      class="text-grey-7 stdc__tabs" @update:model-value="(v) => emit('update:tab', v)">
      <q-tab name="reconciliation" label="Reconciliation" />
      <q-tab name="compliance" label="Compliance" />
    </q-tabs>

    <q-table v-if="tab === 'compliance'" class="ds-table stdc__table" :rows="rows" :columns="COLUMNS" row-key="id" flat bordered
      :pagination="{ rowsPerPage: 0 }" hide-bottom no-data-label="No teams match these filters."
      @row-click="(_, row) => emit('open-team', row.id)">
      <template #body-cell-need="p">
        <q-td :props="p">
          <div class="stdc__need">{{ p.value }}</div>
          <div class="stdc__bar" :class="`is-${NEED_TONE[p.row.status] || 'exempt'}`" />
        </q-td>
      </template>
      <template #body-cell-res="p">
        <q-td :props="p">{{ p.value }}<span v-if="p.row.resBlocks" class="stdc__sub"> ({{ p.row.resBlocks }})</span></q-td>
      </template>
      <template #body-cell-nights="p">
        <q-td :props="p">{{ p.value }}<span v-if="p.row.nightsBlocks" class="stdc__sub"> ({{ p.row.nightsBlocks }})</span></q-td>
      </template>
    </q-table>

    <q-table v-else class="ds-table stdc__table" :rows="recRows" :columns="REC_COLUMNS" row-key="id" flat bordered
      :pagination="{ rowsPerPage: 0 }" hide-bottom no-data-label="No events match these filters."
      @row-click="(_, row) => emit('open-reconciliation', row.id)" />
  </div>
</template>

<style scoped>
.stdc { padding: 24px 28px 56px; background: var(--ds-color-surface); min-height: 100%; }
.stdc__title { margin: 0; font-size: 1.75rem; line-height: 1.3; font-weight: 700; letter-spacing: -0.01em; color: var(--ds-color-text); }
.stdc__export { border: 1px solid var(--ds-color-border-bold); color: var(--ds-color-text-subtle); background: var(--ds-color-surface); min-height: 40px; padding: 0 8px 0 12px; }
.stdc__filters { padding: 16px 20px; }
.stdc__filterbtn { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15); padding: 0 14px; min-height: 40px; }
.stdc__by { font-size: 0.9375rem; color: var(--ds-color-text); }
.stdc__chip {
  display: inline-flex; align-items: center; gap: 6px; padding: 6px 8px 6px 12px;
  border: 1px solid var(--ds-color-border-bold); border-radius: var(--ds-radius-sm);
  background: var(--ds-color-surface-sunken); font-size: 0.9375rem; color: var(--ds-color-text);
}
.stdc__chip-x { display: inline-flex; padding: 0; border: 0; background: none; cursor: pointer; color: var(--ds-color-icon-subtle); }
.stdc__none { font-size: 0.875rem; color: var(--ds-color-text-subtle); }
.stdc__panel { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px 24px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--ds-color-border); }
.stdc__panel-end { display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-end; gap: 12px; }
.stdc__tabs { margin: 16px 0 20px; border-bottom: 1px solid var(--ds-color-border); }
.stdc__table :deep(tbody tr) { cursor: pointer; }
.stdc__need { font-size: 0.9375rem; line-height: 1.2; }
.stdc__bar { height: 6px; border-radius: 3px; margin-top: 4px; width: 100%; max-width: 160px; }
.stdc__bar.is-ok { background: var(--ds-color-background-success-bold); }
.stdc__bar.is-exempt { background: var(--ds-color-background-info-bold); }
.stdc__bar.is-away { background: var(--ds-color-text-subtle); }
.stdc__bar.is-need { background: var(--ds-color-background-danger); border: 1px solid var(--ds-color-border); }
/* The brand font turns "(2)" into a circled ② through contextual alternates;
   switch them off so the grey count reads as production's "(2)". */
.stdc__sub { color: var(--ds-color-text-subtlest); font-feature-settings: 'calt' 0, 'case' 0; font-variant-ligatures: none; }
@media (max-width: 1100px) { .stdc__panel { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
